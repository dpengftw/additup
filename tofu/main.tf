terraform {
  required_providers {
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.0"
    }
  }
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}

# 1. Enable the Firebase and Hosting APIs
resource "google_project_service" "firebase" {
  provider = google-beta
  service  = "firebase.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "hosting" {
  provider = google-beta
  service  = "firebasehosting.googleapis.com"
  disable_on_destroy = false
}

# 2. Initialize the Firebase Project
resource "google_firebase_project" "default" {
  provider = google-beta
  project  = var.project_id

  depends_on = [google_project_service.firebase]
}

# 3. Register a Web App within Firebase
resource "google_firebase_web_app" "default" {
  provider     = google-beta
  project      = var.project_id
  display_name = "My Free Static Site"

  depends_on = [google_firebase_project.default]
}

# 4. Create the Firebase Hosting Site
resource "google_firebase_hosting_site" "default" {
  provider = google-beta
  project  = var.project_id
  site_id  = var.site_name # e.g., "my-awesome-free-site"
  app_id   = google_firebase_web_app.default.app_id

  depends_on = [google_firebase_web_app.default]
}

# Create a Service Account for GitHub Actions
resource "google_service_account" "github_actions" {
  account_id   = "github-deploy-sa"
  display_name = "GitHub Actions Deployment Account"
}

# Grant the Service Account permission to deploy to Firebase
resource "google_project_iam_member" "firebase_admin" {
  project = var.project_id
  role    = "roles/firebasehosting.admin"
  member  = "serviceAccount:${google_service_account.github_actions.email}"
}
