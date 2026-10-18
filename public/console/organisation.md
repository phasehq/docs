import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description =
  'This guide will explain how organisations work in Phase'

<Tag variant="small">CONSOLE</Tag>

# Organisations

Organisations in Phase contain all your [Apps](/console/apps) and [Users](/console/users), and allow you to collaborate with your team.

<DocActions /> 

## Create an Organisation

When you sign up on Phase, you will need to create an Organisation. You must choose a name for your Organisation that can contain letters or numbers. Organisation names must be unique.

![create organisation](/assets/images/console/organisation/organisation-create.webp)

## Apps

This page lists all Apps in your Organisation, along with information about the number of members, environments, integrations and service accounts accessible by you in each App. Click on an App to view and manage it.

![organisation apps](/assets/images/console/organisation/organisation-apps.webp)

## Members

This page lists all members of your Organisation. If you are an Owner or Admin, you can modify member roles from this screen.

![organisation members](/assets/images/console/organisation/organisation-members.webp)

You can also invite new members to your Organisation. To invite a new member, click on the "Add a member" button, enter the email of the user you wish to invite, optionally select a role and click "Invite". You will need to manually provision access to Apps for the new member.

![invite member](/assets/images/console/organisation/organisation-member-invite.webp)

You are limited to selecting a non Global Access role when inviting a new member. This is because the user has not created an account and associated cryptographic keys. For more information on Global Access roles, see [Roles](/access-control#global-access).

Once a member has joined, you can grant them access to specific Apps and Environments from their member page.

![Grant a member access to an App](/assets/images/console/users/users-add-app.webp)

When you invite a member or change a member's role, you can only select a role whose permissions your own role also has. This limit does not apply to users with the Owner or Admin role.

## Settings

This page shows your account and recovery info related to this Organisation. You can view your current role, preferences and download your account recovery kit from this screen. This page will also show you the current billing status of your Organisation.

![organisation settings](/assets/images/console/organisation/organisation-settings.webp)

The **Account & Security** tab lets you view your recovery kit and change your password for this account.

![Account & Security settings](/assets/images/console/organisation/organisation-settings-account-security.webp)

![View your account recovery kit](/assets/images/console/users/view-recovery-kit.webp)

## Transfer Ownership

Organisation Owners can transfer ownership to another member who has the [Admin](/access-control/roles#admin) role. This is useful when an organisation needs to change hands, such as when the current owner is leaving the team or delegating responsibilities.

<Warning>
  Make sure the new Owner has access to their **account recovery kit** before transferring ownership. After the transfer, the new Owner's recovery kit will be the **only** way to restore access to the organisation if they forget their `sudo` password.
</Warning>


To transfer ownership:

1. Log in as the Organisation **Owner** and navigate to your Organisation **Settings**. Scroll down to the **Danger Zone** section and click **Transfer Ownership**.
![transfer ownership settings](/assets/images/console/organisation/organisation-transfer-ownership-1.webp)
2. Select the Admin member you want to make the new Owner. Only members with the Admin role are eligible.
![select new owner](/assets/images/console/organisation/organisation-transfer-ownership-2.webp)
3. Review the changes, confirm that the new Owner has backed up their account recovery kit, and acknowledge that you will lose your Owner privileges. Click **Transfer Ownership** to complete the transfer. If you are using Phase Cloud, you will see a section for updating the billing email address.
![confirm transfer](/assets/images/console/organisation/organisation-transfer-ownership-3.webp)

Once the transfer is complete:

- The selected member becomes the new **Owner** of the organisation.
- You will be demoted to an **Admin** and will continue to remain a member of the organisation until removed.
- Both the old and new Owner will receive an email notification about the transfer.

## Delete an Organisation

Organisation Owners can delete an organisation. Deleting it locks the organisation at once. After 7 days, Phase permanently deletes the organisation and all of its data. Until then, the Owner can restore it.

<Warning>
  Once the 7 days have passed, deletion **can't be undone**. Audit logs and secret access logs are deleted with the organisation.
</Warning>

To delete an organisation:

1. Log in as the Organisation **Owner** and navigate to your Organisation **Settings**. Scroll down to the **Danger Zone** section and click **Delete Organisation**.
![delete organisation settings](/assets/images/console/organisation/organisation-delete-1.webp)
2. Review what stops working now and what will be deleted. Type the organisation name to confirm, then click **Delete organisation**.
![confirm organisation deletion](/assets/images/console/organisation/organisation-delete-2.webp)

### Pending Deletion

For the next 7 days, the organisation is locked:

- Nobody can open it. It stays in the organisation list, with its deletion date.
- Access tokens, service accounts, SCIM and external identities stop working, so apps and CI pipelines can't fetch secrets.
- Secret syncs and secret rotations pause.
- On Phase Cloud, a paid subscription is set to cancel at the end of the current billing period.

### Restore an Organisation

The Owner can restore the organisation at any time during the 7 days. In the organisation list, click **Restore organisation** on its card. Other members can see the deletion date, but only the Owner can restore it.

![restore organisation](/assets/images/console/organisation/organisation-restore.webp)

After a restore, the organisation works as before. Paused syncs and rotations resume, and on Phase Cloud the subscription resumes.

### Permanent Deletion

After 7 days, Phase:

- Revokes active [dynamic secret](/console/dynamic-secrets) leases and [rotating secret](/console/rotating-secrets) credentials at the provider.
- Stops syncs and log streams. Secrets already synced to other services stay there.
- On Phase Cloud, cancels the remaining subscription.
- Deletes the organisation and all of its data: apps, environments, secrets and secret history, members, invites, teams, roles, network access policies, service accounts and access tokens, integrations, log streams, SSO and SCIM configuration, audit logs and secret access logs.
- Deletes accounts provisioned by SCIM that don't belong to another organisation.
- Emails the Owner to confirm the deletion.
