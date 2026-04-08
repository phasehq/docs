import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description = 'Set up SCIM v2 provisioning to automatically sync users and groups from your identity provider to Phase.'

<Tag variant="small">PROVISIONING</Tag>

# SCIM Provisioning

SCIM (System for Cross-domain Identity Management) v2 enables automatic user and group provisioning from your identity provider (IdP) to Phase. When configured, your IdP can automatically create, update, and deactivate user accounts in Phase, eliminating the need for manual user management.

<DocActions />

<Note>
  SCIM provisioning is available for organisations with an `Enterprise` tier subscription. See [Pricing](https://phase.dev/pricing).
</Note>

## How it works

When SCIM is enabled, your identity provider communicates with Phase's SCIM v2 API to:

- **Provision users**: Automatically create Phase accounts when users are assigned to the application in your IdP. Users are created with a `Pending` status until they complete their first login and account setup.
- **Deprovision users**: Automatically deactivate Phase accounts when users are unassigned or disabled in your IdP. The user's environment keys are revoked and their org membership is soft-deleted.
- **Sync groups**: Map IdP groups to Phase Teams, automatically managing team membership as group assignments change.
- **Update user attributes**: Keep user details (name, email) in sync between your IdP and Phase.

### User lifecycle

1. **IdP assigns user** → SCIM creates a Phase user account with `Pending` status (SCIM + Pending badges shown in the console)
2. **User logs in via SSO** → Phase auto-links the SSO account to the SCIM-provisioned user
3. **User completes account setup** → User sets up their sudo password and recovery phrase, enabling them to decrypt secrets
4. **IdP unassigns user** → SCIM deactivates the user, revokes environment keys, and removes them from the organisation

## Enable SCIM in Phase

Before configuring your identity provider, enable SCIM in the Phase Console and create a provisioning token:

1. Log into the Phase Console as an **Owner** or **Admin**.

2. Navigate to **Access** > **SCIM** in the sidebar.

3. Toggle **Enable SCIM** to on.

4. Copy the **SCIM Base URL** shown on the page. It will look like:

   ```
   https://[YOUR_PHASE_HOST]/service/scim/v2/
   ```

5. Click **Create token** to generate a SCIM bearer token. Give it a descriptive name (e.g., "Azure Entra ID") and select an expiry period.

6. Copy the generated token immediately — it will not be shown again. This token will be used as the **Secret Token** in your identity provider's SCIM configuration.

<Warning>
  Treat the SCIM token like a password. Anyone with this token can provision and deprovision users in your Phase organisation.
</Warning>

## Microsoft Entra ID (Azure AD)

Microsoft Entra ID supports SCIM-based provisioning through Enterprise Applications. Follow these steps to configure automatic user and group provisioning from Entra ID to Phase.

### Prerequisites

- A Microsoft Entra ID tenant with a P1 or P2 license (required for enterprise app provisioning)
- An existing Phase Enterprise organisation with SCIM enabled and a SCIM token (see above)
- OIDC SSO configured for Microsoft Entra ID (see [Entra ID OIDC setup](/access-control/authentication/oidc-sso#microsoft-entra-id--azure-ad))

<Note>
  SCIM provisioning and OIDC SSO are complementary features. SCIM handles account lifecycle (creation, deactivation), while OIDC handles authentication (login). You should configure both for the best experience.
</Note>

### Step 1: Create an Enterprise Application

1. Sign in to the [Azure Portal](https://portal.azure.com).

2. Navigate to **Microsoft Entra ID** > **Enterprise applications**.

3. Click **+ New application** at the top.

4. Click **+ Create your own application**.

5. Enter a name for the application (e.g., "Phase Console SCIM"), select **Integrate any other application you find in the gallery (Non-gallery)**, and click **Create**.

### Step 2: Configure Provisioning

1. In your newly created Enterprise Application, select **Provisioning** from the left sidebar under *Manage*.

2. Click **Get started** or set the **Provisioning Mode** to **Automatic**.

3. Under **Admin Credentials**, enter:
   - **Tenant URL**: The SCIM Base URL from Phase (e.g., `https://[YOUR_PHASE_HOST]/service/scim/v2/`)
   - **Secret Token**: The SCIM token you generated in Phase

4. Click **Test Connection** to verify connectivity. Azure should report "The supplied credentials are authorized to enable provisioning".

5. Click **Save**.

### Step 3: Configure Attribute Mappings

After saving credentials, Azure will show the **Mappings** section. You need to configure both user and group mappings.

#### User Attribute Mappings

1. Click **Provision Microsoft Entra ID Users**.

2. Ensure the following mappings are present (these are the minimum required by Phase's SCIM implementation):

   | Microsoft Entra ID Attribute | customappsso Attribute | Mapping Type |
   |------|-------|------|
   | `userPrincipalName` | `userName` | Direct |
   | `Switch([IsSoftDeleted], , "False", "True", "True", "False")` | `active` | Expression |
   | `mail` | `emails[type eq "work"].value` | Direct |
   | `displayName` | `displayName` | Direct |
   | `givenName` | `name.givenName` | Direct |
   | `surname` | `name.familyName` | Direct |

   <Note>
     The `mail` → `emails[type eq "work"].value` mapping is important. Phase uses this email to link the SCIM-provisioned account with the SSO login. If your users don't have the `mail` attribute populated in Entra ID, you can map `userPrincipalName` to `emails[type eq "work"].value` instead.
   </Note>

3. Click **Save**.

#### Group Attribute Mappings

1. Go back to the Provisioning page and click **Provision Microsoft Entra ID Groups**.

2. Ensure the following mappings are present:

   | Microsoft Entra ID Attribute | customappsso Attribute | Mapping Type |
   |------|-------|------|
   | `displayName` | `displayName` | Direct |
   | `objectId` | `externalId` | Direct |
   | `members` | `members` | Direct |

3. Click **Save**.

### Step 4: Assign Users and Groups

1. Navigate to **Users and groups** in the left sidebar of your Enterprise Application.

2. Click **+ Add user/group**.

3. Select the users and/or groups you want to provision to Phase, then click **Assign**.

<Note>
  Only users and groups explicitly assigned to the Enterprise Application will be provisioned. The default scope setting is "Sync only assigned users and groups".
</Note>

### Step 5: Start Provisioning

1. Go back to the **Provisioning** page.

2. Click **Start provisioning** to begin the initial sync.

3. The initial provisioning cycle may take a few minutes. You can monitor progress under **Provisioning logs** in Azure, or in the **SCIM > Provisioning Logs** section of the Phase Console.

4. Once complete, provisioned users will appear on the Phase **Members** page with `SCIM` and `Pending` badges. Groups will appear as **Teams** in Phase.

### Step 6: Test the Flow

1. Verify that provisioned users appear in the Phase Console under **Access** > **Members** with the SCIM and Pending badges.

2. Have a provisioned user log in via SSO (Entra ID OIDC). They will be redirected to the **account setup** page to set up their sudo password and recovery phrase.

3. After completing account setup, the user should be able to access secrets in any environments their team has access to.

### Troubleshooting: Microsoft Entra ID

#### Provisioning shows "quarantine" status

This usually means Azure received multiple errors from the SCIM endpoint. When quarantined, Azure exponentially backs off the retry interval (up to several hours between attempts). Check:
- The SCIM token hasn't expired (check the Phase Console SCIM page)
- The Phase instance is accessible from Azure's IP ranges
- Review the provisioning logs in both Azure and the Phase Console for specific error messages

To clear a quarantine and resume normal provisioning:

1. In the Azure Portal, go to your Enterprise Application > **Provisioning**.
2. Click **Stop provisioning** and wait for it to confirm.
3. Click **Start provisioning** — this clears the quarantine state and triggers a fresh initial sync.
4. Verify the **Provisioning Status** toggle is set to **On**, then click **Save**.

<Note>
  "Restart provisioning" clears the quarantine but does not always re-enable the provisioning toggle. Always verify the toggle is **On** and click **Save** after restarting.
</Note>

#### User can't log in after SCIM provisioning

Ensure that:
1. OIDC SSO is configured for Entra ID (SCIM handles provisioning, OIDC handles login)
2. The user's email in Entra ID matches between the SCIM provisioning and the OIDC token claims
3. The user is assigned to both the SCIM Enterprise Application and the OIDC App Registration (or the OIDC app allows all directory users)

#### Re-provisioning a previously deactivated user

If you remove a user from the application and then re-add them, Azure may skip provisioning with a `RedundantSoftDelete` error. To resolve this:

1. Stop provisioning in the Enterprise Application
2. Ensure the user is assigned under **Users and groups**
3. Go to **Provisioning** > click **Restart provisioning** (this clears Azure's internal cycle state)
4. If the issue persists, use **Provision on demand** for the specific user after restarting provisioning

#### Groups not syncing as Teams

Ensure that:
- Group provisioning is enabled in the attribute mappings
- The groups are assigned to the Enterprise Application
- The `displayName` and `members` attributes are mapped correctly

## Okta

Okta supports SCIM-based provisioning through its application integration platform. Follow these steps to configure automatic user and group provisioning from Okta to Phase.

### Prerequisites

- An Okta organisation with the ability to create custom SCIM integrations
- An existing Phase Enterprise organisation with SCIM enabled and a SCIM token (see [Enable SCIM in Phase](#enable-scim-in-phase))
- OIDC SSO configured for Okta (see [Okta OIDC setup](/access-control/authentication/oidc-sso#okta))

<Note>
  SCIM provisioning and OIDC SSO are complementary features. SCIM handles account lifecycle (creation, deactivation), while OIDC handles authentication (login). You should configure both for the best experience.
</Note>

### Step 1: Create a SCIM Application in Okta

If you already have an Okta OIDC app for Phase SSO, you can add SCIM provisioning to it. Otherwise, create a new app:

1. Sign in to the [Okta Admin Console](https://admin.okta.com).

2. Navigate to **Applications** > **Applications**.

3. If adding SCIM to an existing app, click on your Phase OIDC app and skip to Step 2. Otherwise, click **Create App Integration**.

4. Select **SWA - Secure Web Authentication** (this creates a bookmark app that supports SCIM provisioning), and click **Next**.

5. Enter a name (e.g., "Phase Console") and the login URL for your Phase instance. Click **Finish**.

<Note>
  If you already have a separate OIDC app for SSO, you can use a SWA app purely for SCIM provisioning. Users will still authenticate via the OIDC app — the SWA app only handles user/group lifecycle.
</Note>

### Step 2: Enable SCIM Provisioning

1. In your application, go to the **General** tab.

2. Click **Edit** on the App Settings panel.

3. Under **Provisioning**, select **SCIM** and click **Save**.

4. A new **Provisioning** tab will appear. Click on it.

5. Under **SCIM Connection**, click **Edit** and enter:
   - **SCIM connector base URL**: The SCIM Base URL from Phase (e.g., `https://[YOUR_PHASE_HOST]/service/scim/v2`)
   - **Unique identifier field for users**: `userName`
   - **Supported provisioning actions**: Check **Push New Users**, **Push Profile Updates**, and **Push Groups**
   - **Authentication Mode**: `HTTP Header`
   - **Authorization**: Paste the SCIM bearer token you generated in Phase (the token value only, without the `Bearer` prefix)

6. Click **Test Connector Configuration** to verify connectivity. Okta should report success for the enabled actions.

7. Click **Save**.

### Step 3: Configure Provisioning Actions

1. Still on the **Provisioning** tab, click **To App** in the left panel.

2. Click **Edit** and enable:
   - **Create Users** — Allows Okta to provision new users in Phase
   - **Update User Attributes** — Keeps user details in sync
   - **Deactivate Users** — Deactivates Phase accounts when users are unassigned in Okta

3. Click **Save**.

### Step 4: Verify Attribute Mappings

1. Still under **Provisioning** > **To App**, scroll down to the **Attribute Mappings** section.

2. Okta pre-populates a comprehensive set of default attribute mappings. No changes are required — the defaults already include everything Phase needs. Verify that the following key mappings are present:

   | Okta Attribute | App Attribute | Default Value |
   |------|-------|------|
   | `userName` | `userName` | Configured in Sign On settings |
   | `givenName` | `name.givenName` | `user.firstName` |
   | `familyName` | `name.familyName` | `user.lastName` |
   | `email` | `emails[type eq "work"].value` | `user.email` |
   | `displayName` | `displayName` | `user.displayName` |

   <Note>
     Okta sends many additional attributes by default (phone, address, title, etc.). Phase safely ignores any attributes it doesn't need — you can leave them as-is or remove them if you prefer a minimal mapping.
   </Note>

   <Note>
     Okta uses `userName` (typically the user's email address) as the primary identifier. Ensure that the `userName` in Okta matches the email address used for SSO login, so Phase can link the SCIM-provisioned account with the OIDC identity.
   </Note>

### Step 5: Assign Users and Groups

1. Go to the **Assignments** tab in your application.

2. Click **Assign** and select either **Assign to People** or **Assign to Groups**.

3. Select the users and/or groups you want to provision to Phase, then click **Assign** and **Save and Go Back**.

4. If you assigned groups, go to the **Push Groups** tab:
   - Click **Push Groups** > **Find groups by name** (or by rule)
   - Select the groups you want to push to Phase
   - Click **Save**

<Note>
  In Okta, assigning a group under **Assignments** grants group members access to the app (user provisioning). The **Push Groups** tab controls whether the group itself is synced to Phase as a Team. You typically need both: assign the group for user provisioning, and push the group for team creation.
</Note>

### Step 6: Verify Provisioning

1. Navigate to **Dashboard** > **Tasks** in the Okta Admin Console to monitor provisioning progress.

2. Check the Phase Console under **Access** > **Members** — provisioned users should appear with `SCIM` and `Pending` badges.

3. Check **Access** > **Teams** — pushed groups should appear as teams with a `SCIM` badge.

4. Have a provisioned user log in via Okta SSO. They will be redirected to the account setup page to set up their sudo password and recovery phrase.

### Troubleshooting: Okta

#### "Error authenticating" when testing the connector

- Verify the SCIM base URL ends with `/scim/v2` (no trailing slash)
- Verify the token is entered without the `Bearer` prefix — Okta adds it automatically
- Ensure the SCIM token hasn't expired in the Phase Console

#### Users not being provisioned

- Check that **Create Users** is enabled under **Provisioning** > **To App**
- Verify users are assigned to the application under the **Assignments** tab
- Check the **Tasks** page in Okta for specific error messages
- Review the SCIM provisioning logs in the Phase Console for request/response details

#### Groups not syncing as Teams

- Ensure the group is both **assigned** to the app (Assignments tab) and **pushed** (Push Groups tab)
- Check that the group push status shows "Active" — if it shows an error, click on it for details
- Verify that group push is enabled in the SCIM connector settings (**Push Groups** checkbox)

#### User deprovisioned after removing direct assignment, despite being in a pushed group

In Okta, **Push Groups** and **Assignments** are independent:
- **Assignments** controls user provisioning (who gets a Phase account)
- **Push Groups** controls group/team syncing (which groups appear as Phase Teams)

If a user is only directly assigned (not via a group assignment), removing that direct assignment deprovisions them — even if they belong to a pushed group. Push Groups does not grant app assignment.

**Fix**: Assign groups under the **Assignments** tab (not just Push Groups). This way, group membership is the single source of truth for both user provisioning and team sync. When a user is removed from the group in Okta, they are automatically deprovisioned and removed from the team.

#### User can't log in after SCIM provisioning

- Ensure OIDC SSO is configured for Okta (SCIM handles provisioning, OIDC handles login)
- The user's email in Okta must match between the SCIM `userName` and the OIDC token `email` claim
- If using separate apps for SCIM and OIDC, the user must be assigned to both
