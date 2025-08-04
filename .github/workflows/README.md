GitHub Actions
==============

We use self-hosted runners for our GitHub Actions workflows, hosted on a Mac Studio in our office


Self-Hosted Runners
-------------------

There is one runner on bare-metal for auto-deploying the staging api (tagged "api-deployment"), 
and two virtual machines used for client checks, each one runner (tagged "client-commit-check"). 
The tags are how github determines which runner is run.


### Mac Studio

The Mac Studio is accessible either
- Physically access the device in the office
- Remotely access via SSH and using VNC to use GUI.

For remote access, on the office network, you can use `macstudio.local`
hostname or on the internet by using Tailscale logged in with `typo.by`
Google account remotely.

Once you have access to the host, use following SSH command to login
to the macOS and forwarding VNC access to local.

```bash
# where $HOSTNAME is either IP address or DNS name on Tailscale, or `macstudio.local`.
ssh -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no" -o "PasswordAuthentication=yes" -L5900:localhost:5900 typo@$HOSTNAME
```

On your Mac, use "Connect to Server..." on Finder and type
`vnc://localhost:5900` to use GUI.

### Bare-metal (native) actions runner

This runner is set up to run the auto-deploy-api script, which deploys the staging API whenever a commit is merged in to main. In order for this to work, we:
1. Installed dotnet 8: `brew install dotnet@8`
2. Installed the OpenVpn cli, and downloaded our VPN credentials to `/Desktop`. The workflow script expects them there. 
2. Gave the "typo" user no password access to start the vpn. To edit sudoers file: 
    - `sudo visudo`
    - Add at the end: "typo ALL=(ALL) NOPASSWD: /opt/homebrew/opt/openvpn/sbin/openvpn"
3. Installed the AWS CLI and authenticated with a unique token for the box, this is used to check the database and run migrations as part of the `deploy.sh` script
4. Leave Docker Desktop running

To run the runner, go to ~/actions-runner. `.run.sh` starts the runner, `svc.sh stop` may be used to stop the runner. 

### Virtual Machines

The Mac Studio runs multiple (up to two, due to Apple's EULA limitation,)
macOS virtual machines and running GitHub Actions runner on it.

The virtual machines are executed by [Tartelet](https://github.com/shapehq/tartelet)
which is using [Tart](https://github.com/cirruslabs/tart).

Tartelet manages ephemeral virtual machines, thus we can have
reproducible GitHub Action running environment.

### Base GitHub Actions Runner Virtual Machine

Use `tart list` to see the list of virtual machines available on
the Mac Studio.

#### `ghcr.io/cirruslabs/macos-sequoia-xcode:latest`

A base virtual machine OCI image made by Tart team.

See <https://github.com/orgs/cirruslabs/packages?tab=packages&q=macos>
for the list of images they made for example.

It is macOS 14.0 install with the latest Xcode with multiple
development tool.

#### `runner`

Our base virtual machine for GitHub Runner, cloned from previous image.

Username: admin
Password: admin

```
tart clone ghcr.io/cirruslabs/macos-sonoma-xcode:latest runner
```

This image has following changes.

- Running for a while with Xcode launched to finish `update_dyld_shared_cache`.
- Installed `xcbeautify`, `swiftlint`, and `swiftformat` by Homebrew.
- Remove `~/actions_runner`, which is installed by Tartelet.

### `runner-1`, `runner-2`

`runner-*` are cloned virtual machine by Tartelet.
These virutal machines are cloned every action execution,
therefore ephemeral.

### Running GitHub Actions Runner on Mac Studio

Use Tartelet app and start virtual machines.

Tartelet tries to keep running two ephemeral virtual machines and
runs GitHub Actions runner on each virtual machine.

See [Tartelet](https://github.com/shapehq/tartelet) documentations for
how it works.
