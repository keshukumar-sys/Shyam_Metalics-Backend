# Shyam Metalics — Backend (Documentation)

## Project Overview

This repository contains the backend API for the Shyam Metalics website. It's an Express-based Node.js application that exposes multiple REST endpoints grouped by feature (policy, environment, financials, investor information, disclosures, awards, blog, news, etc.). The app uses MongoDB via Mongoose for persistence and supports file uploads (local buffer -> AWS S3).

## Tech Stack

- **Runtime:** Node.js
- **Web framework:** Express
- **Database:** MongoDB (via `mongoose`)
- **File uploads:** `multer`, `multer-s3` (S3 upload helper in `config/s3Uploader.js`)
- **AWS SDK:** `@aws-sdk/client-s3`
- **Env:** `dotenv`
- **CORS:** `cors`
- **Other utilities:** `uuid`, `nodemon` (dev)

Dependencies (from `package.json`): `@aws-sdk/client-s3`, `cors`, `dotenv`, `express`, `mongoose`, `multer`, `multer-s3`, `nodemon`, `uuid`.

## Key files / entry points

- Server entry: [server.js](server.js)
- Central (older) router file: [routes.js](routes.js)
- AWS S3 upload helper: [config/s3Uploader.js](config/s3Uploader.js)
- Upload middleware: [middleware/upload.js](middleware/upload.js)
- Routes folder: [Routes/](Routes/)
- Controllers folder: [Controllers/](Controllers/)
- Models folder: [Model/](Model/)

## Environment variables

The app expects environment variables in a `.env` file (or provided in process environment):

- `MONGO_URL` — MongoDB connection string
- `PORT` — port for server (defaults to `3000`)
- `AWS_REGION` — AWS region for S3
- `AWS_ACCESS_KEY_ID` — AWS access key
- `AWS_SECRET_ACCESS_KEY` — AWS secret key
- `AWS_BUCKET_NAME` — target S3 bucket name

(See [config/s3Uploader.js](config/s3Uploader.js) for exact S3 usage.)

## Project structure and purpose

- `server.js` — application bootstrap, middleware registration, route mount points, DB connection
- `routes.js` — consolidated router (used in some places); many feature-specific routers are in `Routes/`
- `Routes/` — route modules exposing endpoints grouped by resource (policy, environment, tds, sebi, familiar, financial, corporate, stock, investor-analyst, investor-information, other, blog, disclosures, award, uploadRoute)
- `Controllers/` — controllers implementing business logic for each resource
- `Model/` — Mongoose schema definitions used by controllers
- `middleware/` — request middleware (file upload handling in `upload.js`)
- `config/` — helper modules such as `s3Uploader.js`

### Controllers (quick list)

Files present in `Controllers/` (each implements create/get endpoints and uses models):
- [AwardController.js](Controllers/AwardController.js)
- [BlogConroller.js](Controllers/BlogConroller.js)
- [CorporateAnnouncementController.js](Controllers/CorporateAnnouncementController.js)
- [DisclosuresController.js](Controllers/DisclosuresController.js)
- [EnvironmentController.js](Controllers/EnvironmentController.js)
- [EventNews.js](Controllers/EventNews.js)
- [EventsStoriesController.js](Controllers/EventsStoriesController.js)
- [FamiliarController.js](Controllers/FamiliarController.js)
- [FinancialContoller.js](Controllers/FinancialContoller.js)
- [InvestorAnalystController.js](Controllers/InvestorAnalystController.js)
- [InvestorInformationController.js](Controllers/InvestorInformationController.js)
- [OtherController.js](Controllers/OtherController.js)
- [PolicyController.js](Controllers/PolicyController.js)
- [SebiController.js](Controllers/SebiController.js)
- [StockExchangeComplianceController.js](Controllers/StockExchangeComplianceController.js)
- [TdsContoller.js](Controllers/TdsContoller.js)

### Models (quick list)

Files under `Model/` (Mongoose schemas and models):
- [AwardMode.js](Model/AwardMode.js)
- [AwardNewsModel.js](Model/AwardNewsModel.js)
- [AwardStories.js](Model/AwardStories.js)
- [BlogModel.js](Model/BlogModel.js)
- [CorporateModel.js](Model/CorporateModel.js)
- [DisclosuresModel.js](Model/DisclosuresModel.js)
- [EnvironmentModel.js](Model/EnvironmentModel.js)
- [ExtraUpload.js](Model/ExtraUpload.js)
- [FamiliarModel.js](Model/FamiliarModel.js)
- [FinancialModel.js](Model/FinancialModel.js)
- [InvestorAnlystModel.js](Model/InvestorAnlystModel.js)
- [InvestorInformationModel.js](Model/InvestorInformationModel.js)
- [OtherModel.js](Model/OtherModel.js)
- [PoliciesModel.js](Model/PoliciesModel.js)
- [QipModel.js](Model/QipModel.js)
- [SebiOnlineDisputeModel.js](Model/SebiOnlineDisputeModel.js)
- [StockExchangeComplianceModel.js](Model/StockExchangeComplianceModel.js)
- [TdsDeclarationModel.js](Model/TdsDeclarationModel.js)

### Routes

Files under `Routes/` implement the URL routing for each feature. Example route files:
- [PolicyRoutes.js](Routes/PolicyRoutes.js)
- [EnvironmentRoutes.js](Routes/EnvironmentRoutes.js)
- [TdsRoutes.js](Routes/TdsRoutes.js)
- [SebiRoutes.js](Routes/SebiRoutes.js)
- [FamiliarRoutes.js](Routes/FamiliarRoutes.js)
- [FinancialRoutes.js](Routes/FinancialRoutes.js)
- [CorporateAnnouncementRoutes.js](Routes/CorporateAnnouncementRoutes.js)
- [StockExchangeComplianceRoutes.js](Routes/StockExchangeComplianceRoutes.js)
- [InvestorAnalystRoutes.js](Routes/InvestorAnalystRoutes.js)
- [InvestorInformationRoutes.js](Routes/InvestorInformationRoutes.js)
- [OtherRoutes.js](Routes/OtherRoutes.js)
- [BlogRoute.js](Routes/BlogRoute.js)
- [DisclosuresRoute.js](Routes/DisclosuresRoute.js)
- [AwardRoute.js](Routes/AwardRoute.js)
- [EventNewsRoute.js](Routes/EventNewsRoute.js)
- [EventStoriesRoute.js](Routes/EventStoriesRoute.js)
- [uploadRoute.js](Routes/uploadRoute.js)

## API Endpoint overview

The application mounts many routers; the main route prefixes (as configured in `server.js`) are:

- `/policy` — policy files and CRUD
- `/environment` — environmental disclosures
- `/tds` — TDS declarations
- `/sebi` — SEBI-related files
- `/familiar` — familiarization materials
- `/financial` — financial reports and details
- `/corporate` — corporate announcements
- `/stock` — stock exchange compliance
- `/investor-analyst` — investor/analyst documents
- `/investor-information` — investor information
- `/other` — miscellaneous files
- `/news` — event news
- `/stories` — event stories
- `/blog` — blog posts
- `/disclosure` — disclosures
- `/award` — awards
- `/extra` — extra upload route

(See the exact route registration in [server.js](server.js).)

## File uploads & S3

- `middleware/upload.js` handles multipart parsing with `multer` and provides `req.file` as buffer.
- `config/s3Uploader.js` uploads buffer data to S3 using `@aws-sdk/client-s3` and returns the public S3 URL.
- Controllers call the upload helper (or use `multer-s3`) to store files and save URLs in MongoDB documents.

## How to run (local)

Prerequisites:
- Node.js (16+ recommended)
- MongoDB connection (Atlas or local)
- AWS credentials and S3 bucket (if using S3 uploads)

Install dependencies:

```bash
npm install
```

Create `.env` with required variables (example):

```
MONGO_URL=mongodb+srv://.../dbname
PORT=3000
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA... 
AWS_SECRET_ACCESS_KEY=...
AWS_BUCKET_NAME=your-bucket-name
```

Start server in dev mode:

```bash
npm run dev
```

Start production:

```bash
npm start
```

## Scripts

- `npm start` — runs `node server.js`
- `npm run dev` — runs `nodemon server.js`

## Notes, conventions, and recommendations

- Many controllers use the same pattern: parse `req.file` (via `multer`), upload to S3, then create/update a Mongoose model entry.
- The server carefully skips JSON/urlencoded body parsing for `multipart/form-data` requests so `multer` can handle them.
- Consider adding request validation (e.g., `joi` or `express-validator`) and centralized error handling middleware for consistency.
- Add API documentation (Swagger/OpenAPI) if you want a machine-readable contract for the endpoints.

## Next steps I can help with

- Generate a complete OpenAPI (Swagger) spec from the routes and controllers.
- Add centralized error handling and request validation.
- Add example Postman collection or automated tests.

---

Documentation saved to: [README.md](README.md)

If you want, I can now generate a Swagger spec or create a Postman collection for these endpoints. Let me know which next step you'd prefer.