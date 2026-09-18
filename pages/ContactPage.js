export class ContactPage {
  constructor(page) {
    this.page = page;

    // Contact Form Locators
    this.nameInput = page.locator('#name');
    this.emailInput = page.locator('#email');
    this.phoneInput = page.locator('#phone');
    this.subjectInput = page.locator('#subject');
    this.messageInput = page.locator('#description');

    // Submit button
    this.submitButton = page.getByRole('button', {
      name: /submit/i
    });

    // Success message
    this.successMessage = page.getByText(
        'Thanks for getting in touch',
        { exact: false }
    );
  }

  // Navigate to Contact page
  async goto() {
    await this.page.goto('/#/contact');
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Fill Contact Form
  async fillContactForm(name, email, phone, subject, message) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.phoneInput.fill(phone);
    await this.subjectInput.fill(subject);
    await this.messageInput.fill(message);
  }

  // Click Submit
  async submitForm() {
    await this.submitButton.click();
  }

  // Fill and Submit Contact Form
  async submitContactForm(name, email, phone, subject, message) {
    await this.fillContactForm(
        name,
        email,
        phone,
        subject,
        message
    );

    await this.submitForm();
  }
}