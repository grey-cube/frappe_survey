from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in frappe_survey/__init__.py
from frappe_survey import __version__ as version

setup(
	name="frappe_survey",
	version=version,
	description="SurveyJS with frappe",
	author="Greycube",
	author_email="admin@greycube.in",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
