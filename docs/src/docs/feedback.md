# Feedback & User Testing Guide

## In-App Feedback Form
- Available to all users (authenticated or not).
- Anonymous users can optionally provide an email for follow-up.
- All submissions are sent to GitHub Issues using the custom YAML template.
- See [GitHub Issue Template](https://github.com/your-org/flight-control/blob/main/.github/ISSUE_TEMPLATE/flight-control-issue.yml).

## User Testing Personas
- Focus on:
  1. Screen-reader users (NVDA, JAWS)
  2. Keyboard-only users
  3. Low-vision users (high-contrast, resizable text)
  4. Cognitive impairments (clear labels, consistent layouts)
- Follow W3C's [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) for widget semantics and keyboard patterns.

## Feedback Channels
- In-app form (preferred)
- [GitHub Issues](https://github.com/your-org/flight-control/issues)
- Slack/email (if available)

## References
- [Accessibility Guide](./accessibility.md)