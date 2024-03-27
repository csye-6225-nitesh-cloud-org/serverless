📧 **Send Verification Email Cloud Function**

This is clound function which will be triggered by pub/sub to send verification emails to users and track emails

### Usage

- The function is triggered by a Google Cloud Pub/Sub message.
- It listens for events with the type `google.cloud.pubsub.topic.v1.messagePublished`.
- The event payload should contain data in base64 format with the user's information (first name, last name, username).

### Dependencies

- `EmailLog`: Model for logging email events.
- `User`: Model for accessing user data.
- [`uuid`](https://www.npmjs.com/package/uuid): Library for generating unique identifiers.
- [`formData`](https://www.npmjs.com/package/form-data): Library for creating form data.
- [`Mailgun`](https://www.npmjs.com/package/mailgun.js): Library for sending emails via Mailgun.
- [`dotenv`](https://www.npmjs.com/package/dotenv): Library for loading environment variables.
- [`functions-framework`](https://www.npmjs.com/package/@google-cloud/functions-framework): Google Cloud Functions framework.

### Environment Variables

- `DOMAIN`: Domain name for the email sender.
- `PORT`: Port number for the verification URL.
- `MAILGUN_API_KEY`: API key for Mailgun.

### Functionality

1. Parses the Pub/Sub message to extract user data.
2. Generates a verification token and constructs a verification URL.
3. Sends an email using Mailgun with the verification URL.
4. Updates the user's verification details in the database.
5. Logs the email event (status, error message, etc.) to the database.

### Logging

- Email events (sent, failed, etc.) are logged to the `EmailLog` model.
- Database operations and email sending status are logged to the console.

### Error Handling

- Errors during email sending are caught and logged.
- Errors during database operations are caught and logged.