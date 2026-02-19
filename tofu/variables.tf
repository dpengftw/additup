variable "project_id" {
  description = "The ID of the existing GCP Project"
  type        = string
}

variable "site_name" {
  description = "The unique ID for your hosting site (will be site-name.web.app)"
  type        = string
}

variable "region" {
  default = "us-central1"
  type    = string
}
