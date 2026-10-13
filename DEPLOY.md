> **Out of date as of the forty-five-minutes rebuild.**
>
> Everything below describes `web/` as a Next.js app deployed with OpenNext.
> `web/` is now a Vite + React single-page app: there is no `next build`, no
> server bundle, no `next/image` and no server-rendered routes, so the pipeline
> as written will not build it.
>
> The good news is that this needs *less* infrastructure, not more. A static
> SPA is S3 plus CloudFront with a rewrite of unmatched paths to `index.html`
> — no Server Lambda, no Image Lambda, no SQS, no DynamoDB tag cache. The
> hosting work is a reduction.
>
> The site live at dum-biryani.com is still the previous Next.js version until
> that change is made.

# Deployment (web/ — Next.js SSR)

The **`web/`** Next.js app is deployed to AWS as a **server-side-rendered**
site using [OpenNext](https://opennext.js.org/) at
<https://dum.meredianandco.com>.

> This is the only deployed frontend in this repo. The root Expo app is paused
> and not deployed.

```
Users → CloudFront ──▶ S3            (static assets: _next/static, public/)
                   ├─▶ Server Lambda  (SSR / RSC / routes)   → SQS → Revalidation Lambda
                   └─▶ Image Lambda   (next/image)           → DynamoDB (tag cache)
```

Unlike the other frontends (pure static S3 + CloudFront), this app keeps full
Next.js features (SSR, `next/image`, dynamic routes like `/order/[id]`), so it
runs on Lambda behind CloudFront. The whole topology is built by OpenNext and
provisioned by the `RJPearson94/terraform-aws-open-next` module.

## Pipeline

1. **CI** (`.github/workflows/ci.yml`) — `npm ci`, lint, `next build` in `web/`.
2. **CD** (`.github/workflows/cd.yml`) — after CI succeeds on `main`: OpenNext
   builds the Lambda bundles + assets, then **`terraform apply`** ships the
   stack. Terraform is the source of truth on every deploy, authenticating via
   **OIDC** (no stored keys).

## State & IAM

- **Remote state**: `s3://meredianandco-tfstate-637361978295/dum/terraform.tfstate`
  (S3 native locking). Shared by local applies and CD.
- **Deploy role** (`DUM-gha-deploy`): intentionally **broad** because CD runs
  `terraform apply` for the full stack (Lambda/S3/CloudFront/SQS/DynamoDB + the
  IAM roles the module creates). Assumable only by this repo's Actions via OIDC.

## One-time setup (`terraform/`)

Requires AWS admin creds and the Route 53 zone for `meredianandco.com`.

```bash
# Build the OpenNext artifacts first (terraform reads web/.open-next):
cd web && npm ci && npx @opennextjs/aws@4.1.8 build && cd ..

cd terraform
terraform init
terraform apply   # ~238 resources; CloudFront takes a few minutes
```

Then set the repo **Actions variables** (Settings → Secrets and variables →
Actions → *Variables*):

| Repo variable         | Value                         |
| --------------------- | ----------------------------- |
| `AWS_DEPLOY_ROLE_ARN` | `terraform output deploy_role_arn` |
| `AWS_REGION`          | `us-east-1`                   |

```bash
R=exerra-ai-org/DUM
gh variable set AWS_DEPLOY_ROLE_ARN -R $R -b "$(cd terraform && terraform output -raw deploy_role_arn)"
gh variable set AWS_REGION          -R $R -b "us-east-1"
```

## Deploying

Merge to `main`. CI runs; on success CD builds and `terraform apply`s. The first
CloudFront propagation can take ~15 min.

## Notes

- **Cost**: unlike the static sites, this stack has baseline/usage cost
  (DynamoDB table, SQS, CloudFront, Lambda invocations). Lambdas scale to zero.
- **OpenNext/Next versions**: built with OpenNext `4.1.8` / Next `16.3.7`; the
  Terraform module is pinned to `3.7.1` (consumes the v3-schema output.json).
  Keep the `@opennextjs/aws` pin in `cd.yml` in sync when upgrading.
