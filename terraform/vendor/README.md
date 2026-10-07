# Vendored: terraform-aws-open-next v3.7.1 (patched)

This is a vendored copy of
[`RJPearson94/terraform-aws-open-next`](https://github.com/RJPearson94/terraform-aws-open-next)
**v3.7.1**, used via a local module source so a required patch is reproducible
in CI (CD runs `terraform apply`).

## The patch

`modules/tf-aws-lambda/main.tf`, resource `aws_lambda_permission.function_url_invoke_permission`:
removed `function_url_auth_type = var.function_url.authorization_type`.

**Why:** AWS's `AddPermission` API rejects `FunctionUrlAuthType` on any action
other than `lambda:InvokeFunctionUrl`:

```
InvalidParameterValueException: FunctionUrlAuthType is only supported for
lambda:InvokeFunctionUrl action
```

Upstream (v3.7.1 and `main`) sets it on the `lambda:InvokeFunction` companion
permission added for the Oct 2025 Function-URL dual-auth change, which fails
with AWS provider v6.67+. The InvokeFunction grant does not need the auth type,
so dropping it is both correct and sufficient.

Upstream issue to track for un-vendoring once fixed:
https://github.com/RJPearson94/terraform-aws-open-next

## Re-syncing

If upstream releases a fix, delete this directory, point `main.tf` back at the
registry source + version, and `terraform init -upgrade`.
