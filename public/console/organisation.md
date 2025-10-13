import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

export const description =
  'This guide will explain how organisations works in Phase'

<Tag variant="small">CONSOLE</Tag>

# Organisations

Organisations in Phase contain all your [Apps](/console/apps) and [Users](/console/users), and allow you to collaborate with your team.

<DocActions /> 

## Create an Organisation

When you signup on Phase, you will need to create an Organisation. You must choose an name for your Organisation that can contain letters or numbers. Organistaion names must be unique.

![create organsation](/assets/images/console/organisation/organisation-create.png)

## Apps

This page lists all Apps in your Organisation, along with information about the number of members, environments, integrations and service accounts accessible by you in each App. Click on an App to view and manage it.

![organsation apps](/assets/images/console/organisation/organisation-apps.png)

## Members

This page lists all members of your Organisation. If you are an Owner or Admin, you can modify member roles from this screen.

![organsation members](/assets/images/console/organisation/organisation-members.png)

You can also invite new members to your Organisation. To invite a new member, click on the "Add a member" button, enter the email of the user you wish to invite, optionally select a role and click "Invite". You will need to manually provision access to Apps for the new member.

![invite member](/assets/images/console/organisation/organisation-memmber-invite.png)

You are limited to selecting a non Global Access role when inviting a new member. This is because the user has not created an account and associated cryptographic keys. For more information on Global Access roles, see [Roles](/access-control#global-access).

## Settings

This page shows your account and recovery info related to this Organisation. You can view your current role, preferences and download your account recovery kit from this screen. This page will also show you the current billing status of your Organisation.

![organsation settings](/assets/images/console/organisation/organisation-settings.png)
