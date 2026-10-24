# Cerebellum 2.0.3

A reusable agent operating prompt for evidence-led planning, small verified actions, testing, authority boundaries and honest completion.

## Use as a system prompt

Copy the complete [Cerebellum-System-Prompt.md](Cerebellum-System-Prompt.md) into your host's system-instruction field. This single text is authoritative and self-contained. No companion document, installed skill or evaluation harness is required.

## Use as a skill

Install this repository's `cerebellum` folder through your host's supported skill mechanism, then explicitly request `Use Cerebellum for this task.` The [SKILL.md](SKILL.md) body is identical to the system prompt; only discovery metadata is added. Use either form to avoid loading duplicate instructions. Skill loading and instruction priority are controlled by your host; skill packaging does not confer system-level authority.

The prompt guides reasoning, proportional planning, failure analysis, test-first implementation and evidence-backed completion. It cannot provide tools, enforcement, persistent memory, background work or orchestration. Its mandatory test-first rules can require extra work; check that this operating method fits your task.

## Status

This release retains the evaluated standalone core unchanged. Subsequent prompt additions did not meet their adoption criteria and are excluded. See [evaluation and limitations](EVALUATION.md). No general superiority or guaranteed correctness is claimed, and use of this package does not install or activate anything automatically.

Original Cerebellum material is distributed under the [MIT licence](LICENSE). [Attribution](ATTRIBUTION.md) and [upstream notices](UPSTREAM-NOTICES.txt) are documentation, not operating dependencies.
