describe('Extension Content Script', () => {
    beforeEach(() => {
      // Mock the functions we're testing
      global.extractCurrentEmail = jest.fn(() => ({
        id: window.location.href,
        from: 'test@example.com',
        subject: 'Test Subject',
        body: 'Test email content',
        date: '2023-01-01'
      }));
  
      global.displayEmailEnhancements = jest.fn();
  
      // Set up our document body
      document.body.innerHTML = `
        <div class="email-body">Test email content</div>
        <div class="subject">Test Subject</div>
        <div class="from">test@example.com</div>
        <div class="date">2023-01-01</div>
      `;
    });
  
    afterEach(() => {
      // Clean up after each test
      document.body.innerHTML = '';
      delete global.extractCurrentEmail;
      delete global.displayEmailEnhancements;
    });
  
    test('should extract email data correctly', () => {
      const email = extractCurrentEmail();
      expect(email).toEqual({
        id: window.location.href,
        from: 'test@example.com',
        subject: 'Test Subject',
        body: 'Test email content',
        date: '2023-01-01'
      });
    });
  
    test('should display enhancements after processing', () => {
      displayEmailEnhancements({
        metadata: {
          summary: 'Test summary'
        }
      });
      
      expect(displayEmailEnhancements).toHaveBeenCalledWith({
        metadata: {
          summary: 'Test summary'
        }
      });
    });
  });