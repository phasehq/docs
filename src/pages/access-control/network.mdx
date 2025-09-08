import { Tag } from '@/components/Tag'
import { DocActions } from '@/components/DocActions'

<Tag variant="small">ACCESS CONTROL</Tag>

# Network

You can control access to resources in Phase from specific IPv4 or IPv6 sources by defining individual IPs or CIDR ranges in a Network Access Policy. You may attach such Network Access Policy to a User and/or Service Accounts individually or enforce it across your entire organization via a Global Policy. This allows you to put an additional layer of security on top of the existing access control mechanisms, by making sure that a client can only gain access to resources in Phase via mediums and/or assets such as the Phase Console, CLI, SDKs, Kubernetes Operator, REST API, etc. while being in the confines of your network.

<DocActions /> 

<Note>
 The ability to create and manage network access policies is available for organizations with a `Pro` or an `Enterprise` tier subscription.
</Note>

## Network Access Policies

Network Access Policies allow you to define allowlists of IP addresses or CIDR ranges from which users or service accounts can access Phase resources. Follow these steps to manage your network access policies:

1. Navigate to the Access Control page from the sidebar and click on the Members tab.
![1-navigate-to-access-control](/assets/images/console/access-control/roles/switch-user-role/1-navigate-to-access-control.png)

2. Click on the Network tab.
![2-go-to-access-control-network-tab](/assets/images/console/access-control/network/access-policy/2-go-to-access-control-network-tab.png)

### Creating a Network Access Policy

1. On the Network Access Policies page, click the "Create policy" button.
![3-create-network-access-policy](/assets/images/console/access-control/network/access-policy/3-create-network-access-policy.png)

2. In the "Create Network Access Policy" popup:
   - Enter a descriptive name for your policy in the "Name" field
   - You can click the "Add current IP" button to automatically add your current IP address to the allowlist
![4-enter-name-own-ip](/assets/images/console/access-control/network/access-policy/4-enter-name-own-ip.png)

3. Add additional IP addresses or CIDR ranges in the "Allowed IPs or CIDR Ranges" field:
   - Enter each IP address individually (e.g., 123.123.123.123, 192.168.1.0/24)
   - Press `Enter`, `Space` bar, `,` after each entry to add it
   - You can add multiple IPs and CIDR ranges as needed
![5-enter-cidr-ranges](/assets/images/console/access-control/network/access-policy/5-enter-cidr-ranges.png)

4. Click the "Create" button to save your Network Access Policy.

5. Your newly created policy will appear in the Network Access Policies list, showing the policy name and the allowed IP addresses/CIDR ranges.
![6-created-policies-edit](/assets/images/console/access-control/network/access-policy/6-created-policies-edit.png)

### Editing a Network Access Policy

1. Locate the policy you want to edit in the Network Access Policies list.

2. Click the "Edit policy" button (📝 icon) associated with that policy.

3. In the "Edit Network Access Policy" modal:
   - Modify the policy name if needed
   - Add or remove IP addresses and CIDR ranges by:
     - Clicking the "x" on the existing IP addresses and CIDR ranges to remove them
     - Entering new IPs or CIDR ranges and pressing `Enter`, `Space` bar, `,`
   - Click "Update" to save your changes
![7-edit-existing-policy-popup](/assets/images/console/access-control/network/access-policy/7-edit-existing-policy-popup.png)

### Applying a Network Access Policy to a User Account

1. Navigate to Access Control > Members.

2. Find the member you want to apply the policy to and click the "Manage" button.

3. Scroll down to the Network Access Policy section and click "Manage policy".

4. Select the policy you want to enable by clicking the toggle button next to it.

5. Click the "Save" button to apply the policy to the user account.

Here's a quick video demo:

<div className="video-container">
  <video controls>
    <source src="/assets/images/console/access-control/network/applying-network-policy/user-accounts.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div>

### Applying a Network Access Policy to a Service Account

1. Navigate to Access Control > Service Accounts.

2. Find the service account you want to apply the policy to and click the "Manage" button.

3. Scroll down to the Network Access Policy section and click "Manage policy".

4. Select the policy you want to enable by clicking the toggle button next to it.

5. Click the "Save" button to apply the policy to the service account.

Here's a quick video demo:

<div className="video-container">
  <video controls>
    <source src="/assets/images/console/access-control/network/applying-network-policy/service-accounts.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div>

## Global Network Policies

Global Network Policies allow you to enforce network access restrictions across your entire organization. When enabled, these policies apply to all users and service accounts that don't have an explicit network access policy attached.

### Enforcing a Global Network Policy

1. On the Network Access Policies page, scroll down to the "Global Policies" section.

2. Click the "Manage global policies" button.
![1-manage-global-access-policy](/assets/images/console/access-control/network/global-access-policy/1-manage-global-access-policy.png)

3. In the "Manage Global Network Access Policies" modal:
   - Select the policy you want to enable globally by clicking the toggle button next to it
   - You can enable multiple global policies if needed
![2-enable-the-network-access-policy](/assets/images/console/access-control/network/global-access-policy/2-enable-the-network-access-policy.png)

4. Click the "Save" button to apply the global policy.

<Warning>
If the network access policy that you are trying to set as a global policy does not include the IP address of your current network source, you will be locked out of the Phase Console after enabling it. Phase will display a warning if your current IP is not in the allowed list.
</Warning>

5. After enabling a global policy, it will be displayed in the Global Policies section of the Network Access Policies page.
![3-policy-enabled-state](/assets/images/console/access-control/network/global-access-policy/3-policy-enabled-state.png)

When attempting to enable a global policy that doesn't include your current IP address, Phase will display the following warning:

"This policy is enabled globally and your current IP (100.85.34.110) is not in the allowed list or any CIDR range. You may be locked out. Continue?"

If you see this warning, you should either:
- Cancel and add your current IP to the policy before enabling it globally
- Only proceed if you have another means of accessing Phase from an IP that is included in the policy

### Access Denied Exceptions

Attempting to access a resource such as secrets from a network source that is not defined in a Network Access Policy will result in a 403 (Access Denied) error.

Phase Console example:

![user-account-phase-console-access-denied](/assets/images/console/access-control/network/applying-network-policy/user-account-phase-console-access-denied.png)

CLI example:
```fish
phase secrets list --app example-app
[14:08:42] Error: 🚫 Access denied: a network access policy restricts access from your IP address.. 
```

REST API example:
```json
{"error":"Access denied: a network access policy restricts access from your IP address."}
```