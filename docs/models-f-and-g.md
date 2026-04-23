# Models F and G — deep reference

> **Status:** reference only. Not on the site yet. Revisit when Model B has been running for several weeks of real per-user data.

This doc builds Models F (Kalman filter) and G (contextual bandit) from first principles — it assumes no prior exposure to state-space models, Bayesian filtering, or reinforcement learning. The goal is that after reading, you can look at the ~15 lines of Python for each model and understand every symbol.

---

## Model F — Kalman filter

### The core problem

E (energy) and S (stress) are **latent** — you can't measure them directly. What you can measure are *noisy proxies*:

- HRV (heart-rate variability from a wearable) — a biological stress signal, but noisy
- Focus-minutes (from ActivityWatch) — a behavioral energy signal, but noisy
- Meeting density, message burst rate, etc.

Each of these is related to E and S by *some* linear combination, plus noise. A Kalman filter is the math for saying: *"Given a bunch of noisy signals that each kind-of-tell-me about the hidden state, what's my best estimate of the hidden state, and how sure am I?"*

### What a "tick" is

A tick is one predict + update cycle of the filter. You run one tick per observation. The battery runs at 5-minute ticks (matching the Model B cadence). At each tick:

1. **Predict**: given what you thought E and S were 5 minutes ago, and the known dynamics (E recovers, S decays), predict what they probably are *now* — before seeing any new data.
2. **Update**: new signals just arrived. Combine them with the prediction, weighted by how trustworthy each signal is, to produce an updated estimate.

### Why track uncertainty

The Kalman filter doesn't just track E and S — it tracks *how confident it is* about E and S. This matters because:

- Early on (cold start), the filter knows nothing — wide uncertainty bands.
- When many signals agree, uncertainty narrows — the filter "sharpens up."
- When signals disagree, or when some are missing, uncertainty widens again.

The battery display can render this: a wide uncertainty band means "I'm guessing" — useful for knowing when to trust the score.

### The state and its covariance

The state vector is
```
x = [E, S]ᵀ
```
just a column of two numbers. But E and S are not independent — if we push E down, we usually also push S up (stress and energy are coupled). So instead of tracking two separate variances, we track a 2×2 covariance matrix:

```
P = [ Var(E)      Cov(E,S) ]
    [ Cov(E,S)   Var(S)    ]
```

`Var(E)` is how uncertain we are about energy. `Var(S)` same for stress. The off-diagonal `Cov(E,S)` captures that they move together — information about one narrows the other.

### The four matrices

**A — the transition matrix (dynamics between ticks).** This encodes "what happens to the state on its own, between observations." For the battery, E exponentially recovers toward some baseline and S exponentially decays:

```
A ≈ [ 1 − dt/τ_E       0         ]
    [   0            1 − dt/τ_S  ]
```

At each tick, `x_new ≈ A · x_old`. If dt = 5 min and τ_E = 120 min, E retains 95.8% of its value per tick (natural recovery toward baseline is a different linear term we can tack on). τ_S ≈ 3 days makes S shrink almost imperceptibly per 5-minute tick — exactly as we want.

**Q — process noise covariance.** "How much does the state drift on its own each tick, beyond what A predicts?" Life is noisy. Q is a 2×2 that says: even when nothing happens externally, expect some jitter in E and S. Small values → smooth output. Large values → responsive but jittery.

**H — observation matrix (state → signals).** Each signal is a linear function of E and S plus noise. For a 3-signal system (HRV, focus-minutes, meeting-density):

```
        E     S
HRV   [  0   -1 ]     # more stress → lower HRV
focus [  1   -.3]     # more energy → more focus; stress slightly reduces it
meet  [ -.2   1 ]     # meetings slightly drain E; lots of meetings raise S
```

H is 3 rows (one per signal) × 2 cols (one per state variable). `H · x` = the signals you'd *expect* given the state. Comparing that to the signals you actually got is how the filter updates.

**R — measurement noise covariance.** "How noisy is each signal?" 3×3 diagonal matrix (assuming signal noises are uncorrelated, which they usually approximately are). The single most important matrix to get right. If you tell the filter HRV is noise-free, it'll trust HRV completely and ignore everything else. In practice you measure R per user by running the filter on 2–4 weeks of passive data and computing residuals.

### The five update lines, annotated

```python
def kalman_update_F(x, P, z, A, H, Q, R):
    # --- predict ---
    x = A @ x              # apply natural dynamics: E decays toward rest, S unwinds
    P = A @ P @ A.T + Q    # uncertainty grows by Q (we weren't observing between ticks)

    # --- update with observation z ---
    y = z - H @ x          # innovation: signal we actually got MINUS signal we predicted
    S = H @ P @ H.T + R    # innovation covariance: uncertainty in the innovation
    K = P @ H.T @ inv(S)   # Kalman gain: how much to trust this observation
    x = x + K @ y          # shift the state estimate toward what the signal implies
    P = (I − K @ H) @ P    # uncertainty shrinks because we just got information
    return x, P
```

The *Kalman gain K* is the punchline. Every row of K says: "if this signal is off from prediction by 1 unit, shift the state estimate by this much." When P is large (uncertain) and R is small (trustworthy signal) → K is large → the filter snaps toward the data. When P is small (confident) and R is large (noisy signal) → K is small → the filter ignores the data.

### A numerical tick example

Start with `x = [65, 40]` (E=65 out of 100, S=40 out of 100), moderate uncertainty. Dynamics: τ_E = 120 min, τ_S = 4320 min (3 days). dt = 5 min.

Predict:
```
A·x = [65·(1−5/120), 40·(1−5/4320)] ≈ [62.3, 39.95]
```
Now observe: HRV = 35 (low), focus-minutes = 70 (decent), meeting density = 6 meetings/hr (spiking).

`H·x ≈ [−40, 50, 27.5]` — the signals we'd expect from the predicted state. But we got `z = [35, 70, 6]`. Innovation `y = z − H·x ≈ [75, 20, −21.5]`.

Huge positive innovation on HRV means "HRV came in much higher than state predicted" → the filter updates S *downward* (less stressed than we thought). Negative innovation on meetings means "fewer meetings than expected" → no S bump from that term. The filter has resolved the disagreement by narrowing onto a state like `x ≈ [63, 32]`: about the same energy, lower stress than we predicted.

### What Model F buys the battery over Model B

- **Uncertainty on the display.** Low confidence = a dimmer or pulsing fill. Visible honesty.
- **Graceful degradation.** Missing signals don't break the filter — they just don't contribute to the update. Model B has to patch this case manually.
- **Optimal weighting.** If HRV is 10× noisier than focus-minutes, the filter automatically weights focus-minutes 10× more. No manual tuning.
- **Modular sensors.** Add a new sensor → add a row to H and a diagonal entry to R. No rewrite.

The cost is 2–4 weeks of per-user passive data to fit R and Q. Model F is a v3 upgrade of Model B, not a replacement.

---

## Model G — contextual bandit

### Three flavors of machine learning (the necessary-baseline version)

1. **Supervised learning.** You have labeled examples — a photo and "this is a cat." The model learns to map inputs to labels. Classification, regression.
2. **Unsupervised learning.** You have data, no labels. The model finds structure — clusters, embeddings.
3. **Reinforcement learning (RL).** You have an *agent* that takes *actions* in an *environment* and receives *rewards*. The model learns a *policy* — a rule for choosing actions — that maximizes long-run reward.

### What full RL looks like

In chess: agent is white, action is a move, reward is +1 win / −1 loss at game end. The hard part is the **credit-assignment problem**: if you lose the game, *which move was the bad one*? Was it move 23, or the setup eight moves earlier? RL algorithms (Q-learning, policy gradients, etc.) try to propagate reward backward through time.

Full RL is overkill for the battery because:
- We don't have sequential multi-step actions where one move affects what moves are even available later.
- We don't have a terminal reward — rewards happen every tick.
- We care about *this nudge's effect*, not a long chain of downstream consequences.

### The origin of "bandit"

A "one-armed bandit" is a slot machine. Imagine a row of slot machines, each paying out with different (unknown) average rewards. Each pull gives you some cash. How do you maximize winnings over N pulls?

This is the *multi-armed bandit* problem. It's like RL, but with *no state that evolves* — each pull is independent. You just need to figure out which arms pay best.

### Contextual bandit = bandit where context matters

Add context: the payout depends on something you can observe *before pulling* — time of day, your current mood, which room you're in. Now the question is: given this context, which arm is best?

For the battery:
- **Context**: current E, current S, time of day, recent event stream, chronotype, etc.
- **Arms (actions)**: suggested interventions — "take a walk," "close Slack for 30 min," "dim the screen," "do nothing."
- **Reward**: measured change in E over the next hour, or change in S over the next day.
- **Policy π(action | context)**: a learned rule mapping context → which arm to pull.

### The battery loop

```
observe context  →  policy picks arm  →  deliver nudge to user  →  measure reward  →  update policy
```

Over many loops, the policy learns: "when S is high and it's past 3 pm for this user, the walk-outside arm has +12 ΔE and the close-Slack arm has +4 ΔE." Next time that context recurs, prefer the walk.

### The exploration / exploitation tradeoff

The core tension: should the policy always pick the arm it currently thinks is best (*exploit*), or sometimes try other arms to discover whether they're actually better (*explore*)?

Three standard approaches:

- **ε-greedy.** With probability 1−ε (say 90%), pick the best-looking arm. With probability ε (10%), pick a random arm. Simple. Good default.
- **Thompson sampling.** Treat the expected reward of each arm as a distribution (not a point estimate). Each round, sample one reward from each arm's distribution and pick the arm with the highest sample. Arms you're uncertain about get picked occasionally because their distributions are wide.
- **UCB (Upper Confidence Bound).** Always pick the arm with the highest "optimistic estimate" = mean reward + (confidence-interval width). Arms tried rarely have wide intervals → get picked until you know them well. Then narrow → only picked if the mean is actually best.

For the battery, I'd start with Thompson sampling: it's principled, handles context elegantly (one distribution per (context-bucket, arm) pair), and doesn't need manual ε tuning.

### Why Model G is a v3 (not v1)

- Needs a **closed intervention loop** — the battery has to actually deliver nudges and you have to actually act on them. That's downstream of the display existing.
- Needs **months of per-user data** before the policy is better than hand-tuned heuristics.
- **Nudging is ethically loaded.** A bandit is literally learning to push your behavior. You want months of observation and a well-characterized reward function before letting it steer.

---

## References

- Kalman, R.E. (1960). *A New Approach to Linear Filtering and Prediction Problems.*
- Sutton & Barto (2018). *Reinforcement Learning: An Introduction.* Chapter 2 covers bandits.
- Li, Chu, Langford & Schapire (2010). *A Contextual-Bandit Approach to Personalized News Article Recommendation.* (LinUCB — the standard algorithm to try if we go to v3.)
