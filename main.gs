/**
 * Script qui permet de transformer un GDoc en PDF
 * 
 * Service nécessaire : Drive
 * V1
 * 03/03/2023
 * ADargouge
 * 
 *  \    /\
 *   )  ( ')
 *  (  /  )
 *   \(__)|
 */

/**
 * Function to create a new copy of main doc
 */

function onOpen() {
  DocumentApp.getUi().createMenu("--Menu--")
  .addItem("Lancer la création de PDF","main")
  .addSeparator()
  .addItem("Choisir la source de donnée", "showPicker")

  .addToUi();
}

function showPicker() {
  let html = HtmlService.createHtmlOutputFromFile("Picker.html")
    .setWidth(800)
    .setHeight(600)
  DocumentApp.getUi().showModalDialog(html, "Choisir le fichier")
}

function getOauth() {
  DriveApp.getRootFolder();
  return ScriptApp.getOAuthToken();
}

function copyDoc() {
  const docId = DocumentApp.getActiveDocument().getId();
  const copy = DriveApp.getFileById(docId).makeCopy("Template");
  return copy.getId();
}

/**
 * Function to delete the copy file after completion of the loop script
 */
function deleteFile(fileId) {
  Drive.Files.remove(fileId)
}

function checkFolder() {
  let folderSearch = DriveApp.searchFolders('fullText contains "Archive PDF"');
  let founded = false;
  let folder = undefined;
  //on vérifie si le dossier d'archives existe
  while (folderSearch.hasNext()) {
    let directory = folderSearch.next();
    if (directory.getName() === "Archive PDF") {
      folder = directory;
      founded = true;
      return folder
    }
  }
  // si le fichier n'est pas trouvé on le crée
  folder = DriveApp.createFolder("Archive PDF");
  return folder
}

function createPDF(id, folder) {
  //Let blob = DriveApp.getFileById(id).getAs(pdf)
  let blob = DriveApp.getFileById(id).getAs("application/pdf")
  folder.createFile(blob).setName("Export pdf")

}

/**
 * function to find equivalence in the text and replace it
 */
function TextEquiv(text) {
  text = text.toString()
  return text.replace('{{', '').replace('}}', '')
}

/**
 * Function to find text in a doc based on a list
 */
function findText(docId, list) {
  const doc = DocumentApp.openById(docId)
  const body = doc.getBody();
  const regex = /\{\{.*?\}\}/
  const regexString = "\{\{.*?\}\}"

  Logger.log(list)

  while (body.findText(regexString) !== null) {
    let elem = body.findText(regexString).getElement()
    let text = elem.asText().getText()
    let key = TextEquiv(text.match(regexString)[0])
    text = text.replace(regex, list[key])
    elem.asText().setText(text)
  }
  doc.saveAndClose()
  return docId;
}

/**
 * function to format data in the doc 
 */
function prepareData(id, sheetName) {
  const sheet = SpreadsheetApp.openById(id).getSheetByName(sheetName)

  let values = sheet.getDataRange().getValues();
  let header = values.shift().flat();
  let out = []
  values.forEach(val => {
    let temp = {}
    header.forEach((key, idx) => temp[key] = val[idx].toString())
    out.push(temp)
  })
  return out
}

function retriveSheets(id){
  let output = []
  let sheets = SpreadsheetApp.openById(id).getSheets()
  sheets.forEach(e => output.push(e.getName()))
  return output
}

/**
 * A function to rule them all
 */
function main() {
  let list = prepareData("[[your id here]]","[[the sheet name here]]");
  const folder = checkFolder();
  list.forEach(e => {
    let id = copyDoc();
    findText(id, e);
    createPDF(id, folder);
    deleteFile(id);
  })
}
