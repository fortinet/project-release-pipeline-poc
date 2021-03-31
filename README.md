# Project release pipeline POC

This is a proof-of-concept project for a project release automation. This project can also be used
as a starter project that incorporates the release automation workflow as being demonstrated.

This POC is limited to work with a nodejs project.

## Instructions

The [.github/workflows](.github/workflows) folder and the yaml files must be present in the default branch in order to be triggered properly. Some of them are desinged to be triggered by certain GitHub events while the others are desinged to be triggered manually via the [Actions](https://github.com/fortinet/project-release-pipeline-poc/actions) page.

### Workflows

There are 5 GitHub workflows in this POC project. Each of them covers a specific use case.

#### Workflow: create release branch

**trigger type**: manual

**on**: workflow dispatch

This workflow will create a version branch for release preparation purposes. This workflow needs to be triggered manually. A new branch will be branched off the `base-branch`, with the `head-version` number (and an optional name prefix) as branch name.

The `head-version` is determined by the semver versioning strategies and based on the top level package.json in the `base-branch`.

See [create-version-branch.yml](.github/workflows/create-version-branch.yml) for details about the workflow inputs and outputs.

This workflow uses the following GitHub actions:

* fortinet/github-action-version-branch@1.0.0

##### Outcomes

A new branch with a special name will be created. Branch name examples:

* *1.0.0* (without a name prefix; version number `1.0.0`)
* *v2.0.0* (without a name prefix; version number starting with v `v2.0.0`)
* *rel_3.0.0-dev.0* (with a name prefix `rel_`; a prerelease version number `3.0.0-dev.0`)

#### Workflow: draft release pull request

**trigger type**: manual

**on**: workflow dispatch

This workflow will create a draft pull request for `head-branch` to `base-branch`, optionally set the pr title, description, add assignees, reviewers, and labels. This workflow needs to be triggered manually. The title, description, assignees, reviewers, and labels can be stored in a pre-configuration template located in the same project of the workflow.

This workflow uses the following GitHub actions:

* fortinet/github-action-version-pr@1.0.0

Two pull request pre-configuration templates available to reference in demo:

* [.github/workflows/templates/version-pr.yml](.github/workflows/templates/version-pr.yml) (default)
* [examples/templates/version-pr.yml](examples/templates/version-pr.yml)

A set of place holders is available to use in the pre-configuration template. See the GitHub Action project [github-action-version-pr](https://github.com/fortinet/github-action-version-pr) for more information.

##### Outcomes

A new pull request with the specified base branch and head branch will be created. If pre-configuration template is used, the pre-configured title and description for the pull request will be shown, as well as the pre-configured assignees, reviewers, and labels.

Assignees and reviewers will receive notifications for this pull request.

#### Workflow: release on merge version branch

**trigger type**: auto

**on**: pull request merged to the 'main' branch

This workflow will run some post-merged actions for merging the commits from the version branch to the base branch. This workflow is intended to work with these GitHub Action projects: *fortinet/github-action-version-branch* and *fortinet/github-action-version-pr*. It checkouts the base branch, installs node dependencies, builds the project, and makes the release assets. Then it finds the version number of the head branch, creates a GitHub release with a tag using the proper version number, publishes it as a release (or prerelease) based on the *fortinet/github-action-version-branch* output, and uploads the release assets.

This workflow uses the following GitHub actions:

* fortinet/github-action-version-pr@1.0.0
* fortinet/github-action-version-branch@1.0.0
* actions/checkout@v2
* actions/create-release@v1
* svenstaro/upload-release-action@2.2.0

##### Outcomes

A release for a specific tag will be published automatically. Release assets will be also uloaded. The release tag is resolved by the pull request event.

#### Workflow: start versioning release

**trigger type**: manual

**on**: workflow dispatch

This workflow will start a versioning release pipeline. See the sequence diagram [versioning release workflow diagram]() to get the brief idea of the *versioning release pipeline*. It is the initial step of the whole *versioning release pipeline* automation. Therefore, it requires a *version level*, *pre-id*, *custom-version* to properly bump the project version in a following stage; it requires the *base branch*, *name prefix*, *version level* for creating a version branch; it requires *author-name*, *author-email* to create the version commit on behalf of; it requires the *pr-template-uri* to create a pull request with a template in a following stage.

During the step for creating a version branch, a version bumping commit will be also created automatically using the `npm version <version-type>` command. Therefore, the command configurations can rely on the [.npmrc](.npmrc) file in the top level of the project, such as the *version tag prefix*, *version message*. The *preversion*, *version*, *postversion* scripts can also be added to the [package.json](package.json). See: [https://docs.npmjs.com/cli/v7/commands/npm-version](https://docs.npmjs.com/cli/v7/commands/npm-version) for more information.

This workflow uses the following GitHub actions:

* fortinet/github-action-version-pr@1.0.0
* fortinet/github-action-version-branch@1.0.0
* actions/checkout@v2

##### Outcomes

A new branch with a the head version as the name will be branched off the base branch. An additional version bump commit with all versioning related changes is pushed to the version branch. A pull request with proper title and description will be created for the version branch. Assignees, reviewers, and labels may also be set accordingly.

The pull request is created as a draft, ready to start the review process.

##### Stages in the pipeline

As the pipeline is initiated in the 1st stage, the following stages should happen in the following order:

1. **initial stage**: Workflow is manually triggered to inintiate a release pipeline.
2. **review stage**: Reviewers approve the pull request. Pull request is ready for merge.
3. **merge stage**: Merge action takes place by hands or automation. Pull request is merged back to the base branch. All versioning related changes now go into the base.
4. **release stage**: Automatically triggered after the *merge stage*. Release and release assets are now published.

#### Workflow: test on push

**trigger type**: auto

**on**: any change pushed to the *main* and *rel_\** branches.

This workflows automatically checkouts the target branch and performs basic checkings including: npm audit, tests. This workflows will be run against the nodejs runtime: 12.x, 14.x.

This workflow uses the following GitHub actions:

* actions/checkout@v2

##### Outcomes

The full set of checkings against the target branch will either pass all or fail.

## Issues

There are still known issues to the project. Please refer to the [Issues](https://github.com/fortinet/project-release-pipeline-poc/issues) page.

## Support

Fortinet-provided scripts in this and other GitHub projects do not fall under the regular Fortinet technical support scope and are not supported by FortiCare Support Services.
For direct issues, please refer to the [Issues](https://github.com/fortinet/project-release-pipeline-poc/issues) tab of this GitHub project.
For other questions related to this project, contact [github@fortinet.com](mailto:github@fortinet.com).

## License

[License](./LICENSE) © Fortinet Technologies. All rights reserved.
