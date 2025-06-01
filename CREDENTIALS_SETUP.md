# Credentials Setup Guide

## Problem Solved
This guide addresses the security issue where Google Cloud Service Account credentials were accidentally committed to git, causing GitHub's push protection to block commits.

## Solution: Environment Variables

Instead of storing credentials in files that get committed to git, we now use environment variables. This is more secure and follows best practices.

## Setup Instructions

### 1. Create your .env file
Create a `.env` file in the root of your backend project (this file is already in .gitignore):

```bash
# Database
DATABASE_URL="your_database_connection_string_here"

# Google Sheets Integration - REQUIRED
GOOGLE_SHEET_ID="your_google_sheet_id_here"
GOOGLE_PROJECT_ID="your_google_cloud_project_id"
GOOGLE_PRIVATE_KEY_ID="your_private_key_id"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_content_here\n-----END PRIVATE KEY-----"
GOOGLE_CLIENT_EMAIL="your_service_account_email@your_project.iam.gserviceaccount.com"
GOOGLE_CLIENT_ID="your_client_id"
GOOGLE_CLIENT_X509_CERT_URL="https://www.googleapis.com/robot/v1/metadata/x509/your_service_account_email%40your_project.iam.gserviceaccount.com"

# Optional - these have defaults
GOOGLE_SERVICE_ACCOUNT_TYPE="service_account"
GOOGLE_AUTH_URI="https://accounts.google.com/o/oauth2/auth"
GOOGLE_TOKEN_URI="https://oauth2.googleapis.com/token"
GOOGLE_AUTH_PROVIDER_X509_CERT_URL="https://www.googleapis.com/oauth2/v1/certs"
GOOGLE_UNIVERSE_DOMAIN="googleapis.com"

# Application settings
PORT=3000
NODE_ENV=development
```

### 2. Extract values from your credentials file
Open your `config/college-landing-integration-d468e35b8ace.json` file and copy the values to the corresponding environment variables:

- `project_id` → `GOOGLE_PROJECT_ID`
- `private_key_id` → `GOOGLE_PRIVATE_KEY_ID`
- `private_key` → `GOOGLE_PRIVATE_KEY` (keep the \n characters as they are)
- `client_email` → `GOOGLE_CLIENT_EMAIL`
- `client_id` → `GOOGLE_CLIENT_ID`
- `client_x509_cert_url` → `GOOGLE_CLIENT_X509_CERT_URL`

### 3. For Production Deployment

#### Vercel
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add each environment variable from your .env file

#### Other platforms
Set environment variables in your deployment platform's configuration.

### 4. Update other scripts
Update any test scripts or other files that reference the old credentials file path.

## Benefits of This Approach

1. **Security**: Credentials are never committed to git
2. **Flexibility**: Different environments can use different credentials
3. **Team Collaboration**: Team members can have their own credentials without conflicts
4. **Deployment Ready**: Works seamlessly with cloud platforms

## Files Changed

- `src/common/google-sheets.service.ts` - Updated to use environment variables
- `.gitignore` - Added credentials file to prevent future commits
- Removed `config/college-landing-integration-d468e35b8ace.json` from git tracking

## What to do with the local credentials file

You can keep the local `config/college-landing-integration-d468e35b8ace.json` file on your machine for reference, but it will no longer be tracked by git. You can delete it once you've extracted all the values to your .env file. 