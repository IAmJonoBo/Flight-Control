variable "aws_region" {
  description = "AWS region to deploy resources in"
  type        = string
  default     = "us-east-1"
}

variable "gcp_region" {
  description = "GCP region to deploy resources in"
  type        = string
  default     = "us-central1"
}