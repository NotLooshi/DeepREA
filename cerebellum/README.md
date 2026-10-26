# Cerebellum

**A plan is a starting point. Evidence tells you when the work is done.**

[Use the prompt](#use-as-a-system-prompt) | [Install the skill](#use-as-a-skill) | [Evaluation](EVALUATION.md) | [All skills](../README.md)

A reusable agent operating prompt for evidence-led planning, small verified actions, testing, authority boundaries and honest completion.

## What it brings to the work

Cerebellum gives your coding agent a reusable operating method: define the outcome, challenge the assumptions, take the next bounded step, and check what actually happened. It is for tasks where a plausible answer is not enough to establish completion.

| Stage | What the prompt asks the agent to do |
| --- | --- |
| Frame | Identify the outcome, constraints and observable success |
| Challenge | Consider plausible failure modes and repair the plan |
| Act | Make small changes, with test-first checks for production behavior |
| Verify | Connect completion claims to observed results and disclose gaps |

It scales the planning depth to the task. A small, reversible change can use a short record; consequential work calls for deeper investigation. The host still controls permissions and instruction priority.

## Try it

After loading the prompt or installing the skill, give it a bounded task:

```text
Use Cerebellum to fix this reproducible bug.
Define the expected behavior, reproduce the failure with a meaningful test,
make the smallest complete fix, and report the checks you actually ran.
```

For planning without implementation:

```text
Use Cerebellum to review this migration plan.
Identify the assumptions most likely to change the decision,
plausible failures, and the smallest useful next check.
Planning only: do not change files or deploy anything.
```

## Use as a system prompt

Copy the complete [Cerebellum-System-Prompt.md](Cerebellum-System-Prompt.md) into your host's system-instruction field. This single text is authoritative and self-contained. No companion document, installed skill or evaluation harness is required.

## Use as a skill

Install this repository's `cerebellum` folder through your host's supported skill mechanism, then explicitly request `Use Cerebellum for this task.` The [SKILL.md](SKILL.md) body is identical to the system prompt; only discovery metadata is added. Use either form to avoid loading duplicate instructions. Skill loading and instruction priority are controlled by your host; skill packaging does not confer system-level authority.

The prompt guides reasoning, proportional planning, failure analysis, test-first implementation and evidence-backed completion. It cannot provide tools, enforcement, persistent memory, background work or orchestration. Its mandatory test-first rules can require extra work; check that this operating method fits your task.

## What the evidence says

In the main development batch, six tasks were run once under each of three instruction conditions. Cerebellum and the ECC instruction pack each showed test-first execution on all three coding tasks; the default condition showed it on none. All arms passed the initial artifact grades, but supplementary checks later exposed defects in both ECC and Cerebellum.

These are limited development observations, not proof of superior correctness. The released core was retained after later candidates failed their adoption criteria. Read the [evaluation and limitations](EVALUATION.md) for trial scope, scoring corrections and missing independent replication.

## Status

Version 2.0.3. This release retains the evaluated standalone core unchanged. Subsequent prompt additions did not meet their adoption criteria and are excluded. See [evaluation and limitations](EVALUATION.md). No general superiority or guaranteed correctness is claimed, and use of this package does not install or activate anything automatically.

Original Cerebellum material is distributed under the [MIT licence](LICENSE). [Attribution](ATTRIBUTION.md) and [upstream notices](UPSTREAM-NOTICES.txt) are documentation, not operating dependencies.
