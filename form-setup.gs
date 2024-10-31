/**
 * Form setup and configuration utilities
 */

function setupFormValidation() {
  const form = FormApp.getActiveForm();

  // Get all form items
  const items = form.getItems();

  items.forEach((item) => {
    const title = item.getTitle().toLowerCase();

    // Set up Discord ID validation with regex
    if (title.includes(CONFIG.form.discordIdIdentifier)) {
      const textItem = item.asTextItem();
      textItem.setValidation(
        FormApp.createTextValidation()
          .requireTextMatchesPattern("^\\d{17,19}$")
          .setHelpText(
            "Discord ID должен состоять исключительно из цифр, и быть длинной от 17 до 19 символов"
          )
          .build()
      );
    }

    // Set up department selection validation
    if (title.includes(CONFIG.form.multipleChoiceQuestionName)) {
      const multipleChoiceItem = item.asMultipleChoiceItem();
      const validDepartments = Object.keys(ROLES);
      multipleChoiceItem.setChoices(
        validDepartments.map((dept) => multipleChoiceItem.createChoice(dept))
      );
    }
  });
}

/**
 * Creates or updates form title and description
 */
function setupFormMetadata() {
  const form = FormApp.getActiveForm();
  form.setTitle(CONFIG.form.title || "Department Application Form");
  form.setDescription(CONFIG.form.description || "");
}

/**
 * Utility function to reset all form validations
 * Useful when you need to modify validation rules
 */
function resetFormValidation() {
  const form = FormApp.getActiveForm();
  const items = form.getItems();

  items.forEach((item) => {
    try {
      if (item.getType() === FormApp.ItemType.TEXT) {
        item.asTextItem().clearValidation();
      }
    } catch (error) {
      console.error(
        `Error resetting validation for item ${item.getTitle()}:`,
        error
      );
    }
  });
}

/**
 * Main setup function that runs all configuration steps
 */
function setupForm() {
  try {
    console.log("Starting form setup...");

    setupFormMetadata();
    setupFormValidation();

    console.log("Form setup completed successfully");
  } catch (error) {
    console.error("Error during form setup:", error);
    throw error;
  }
}
