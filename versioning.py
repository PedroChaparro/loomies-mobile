import sys
import re

# --- Setup ---
# Get ther version from the argument
if len(sys.argv) < 2:
    print("Version argument is missing")
    sys.exit(1)

version = sys.argv[1]

# Check the version is valid
if not version.startswith("v"):
    print('Version must start with "v"')
    sys.exit(1)

# Get the version number
version_number = version[1:]


# --- Update ---
# Update the version in package.json and build.gradle files
def update_version(version):
    new_package_json_content = ""
    new_build_gradle_content = ""

    # Update package.json
    with open("package.json", "r") as file:
        package_json = file.read()

        package_json = re.sub(
            r'"version": "[0-9]+\.[0-9]+\.[0-9]+"',
            f'"version": "{version_number}"',
            package_json,
        )

        new_package_json_content = package_json

    with open("package.json", "w") as file:
        file.write(new_package_json_content)

    # Update build.gradle
    with open("android/app/build.gradle", "r") as file:
        build_gradle = file.read()

        # The current version code is just an incremental number that is used
        # to help google identifying new versions of the app
        current_version_code = re.search(r"versionCode ([0-9]+)", build_gradle).group(1)

        # The version name is the one that is displayed to the user
        build_gradle = re.sub(
            r'versionName "[0-9]+\.[0-9]+\.[0-9]+"',
            f'versionName "{version_number}"',
            build_gradle,
        )

        build_gradle = re.sub(
            r"versionCode [0-9]+",
            f"versionCode {int(current_version_code) + 1}",
            build_gradle,
        )

        new_build_gradle_content = build_gradle

    with open("android/app/build.gradle", "w") as file:
        file.write(new_build_gradle_content)


# --- Run ---
update_version(version_number)
