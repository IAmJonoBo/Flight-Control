# Pilot Deployment & Feedback Guide

This guide outlines the process for deploying Flight Control for pilot users and collecting actionable feedback.

## Cloud Deployment
- Deploy using the provided Kubernetes manifests and Terraform modules (see [infrastructure/](../../../infrastructure/)).
- Recommended cloud providers: AWS (ECS, EKS) or GCP (GKE).
- Ensure all secrets and credentials are managed securely (e.g., AWS Secrets Manager, GCP Secret Manager).
- Use the provided CI/CD workflows for automated deployment.

## User Onboarding
- Provide users with access to the frontend dashboard and API endpoints.
- Share the [Getting Started](./getting-started.md) and [Accessibility Guide](./accessibility.md).
- Offer a walkthrough session or documentation for key features.

## Feedback Collection
- Encourage users to submit feedback via:
  - [GitHub Issues](https://github.com/your-org/flight-control/issues)
  - Dedicated Slack channel or email (if available)
  - In-app feedback forms (planned)
- Collect feedback on:
  - Usability and user experience
  - Feature requests and pain points
  - Bugs and accessibility issues

## Iteration & Improvement
- Review feedback weekly and triage issues in GitHub.
- Prioritize fixes and enhancements for the next release.
- Update documentation and changelog with each iteration.