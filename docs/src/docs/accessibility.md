# Accessibility & Compliance Guide

Flight Control is committed to building an inclusive, accessible platform for all users. This guide outlines our approach to accessibility and compliance.

## Accessibility Standards
- We aim for compliance with [WCAG 2.1 AA](https://www.w3.org/WAI/standards-guidelines/wcag/) standards.
- All new features should be designed and tested with accessibility in mind.

## Automated Checks
- Accessibility is checked in CI using [axe-core](https://www.deque.com/axe/) on the main dashboard and UI pages.
- Developers are encouraged to run local accessibility checks using browser extensions or CLI tools.

## Manual Testing
- Manual accessibility testing is performed before major releases.
- We welcome feedback and bug reports from users with disabilities.

## Contribution Guidelines
- All pull requests should consider accessibility (labels, color contrast, keyboard navigation, ARIA attributes).
- Use semantic HTML and test with screen readers where possible.
- Reference the [Getting Started](./getting-started.md) and [Developer Guide](./developer-guide.md) for setup and best practices.

## Reporting Issues
- Please report accessibility issues or suggestions via [GitHub Issues](https://github.com/your-org/flight-control/issues).

## Roadmap
- Expand automated tests for full WCAG 2.1 AA coverage.
- Add accessibility documentation to all major UI components.
- Conduct periodic accessibility audits and user testing.