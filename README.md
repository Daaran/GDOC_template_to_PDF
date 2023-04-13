# GDOC_template_to_PDF
A script to automate a GDOC tamplate and generate pdf with given Gsheet data

## Initialization

1. Create a GDOC, desgin it and add tags for the words to replace into double curly brackets
2. Create an appscript file linked to this GDOC
3. Create a GSheet to store the data that will be pushed into the GDOC template
4. Add the Sheet id and the Sheet name into the app script (wip change this into a modal or a picker tool)

The tags for the template must be the smae beetween GSheet headers (1st line) and tags in the Gdoc (i.e: {{My_custom_tag}})

## Usage

Once everything is settled up you can run the button on the gdoc, it will generate a folder in your drive then generate every unique PDF based on the Gdoc template you reated and on the GSheet data you linked.

## Work in progress

1. Add a new system to select data source
2. Let the ability to create one unique pdf
