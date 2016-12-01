/* eslint-disable */

import Ember from 'ember';

const CHARLIMIT = 1000;
const FEEDBACK = {
  normal: 'form-group has-feedback',
  success: 'form-group has-feedback has-success'
};

export default Ember.Controller.extend({

  // Email
  email: '',
  emailFeedback: FEEDBACK['normal'],
  validEmail: Ember.computed.match('email', /^.+@.+\..+$/),
  changeEmailFeedback: Ember.observer('email', function() {
    let feedback = this.get('validEmail') ? 'success' : 'normal';
    this.set('emailFeedback', FEEDBACK[feedback]);
    this.set('responseMessage', '');
  }),

  // Message
  msg: '',
  msgFeedback: FEEDBACK['normal'],
  validMsg: Ember.computed.gte('msg.length', 5),
  changeMsgFeedback: Ember.observer('msg', function() {
    let feedback = this.get('validMsg') ? 'success' : 'normal';
    this.set('msgFeedback', FEEDBACK[feedback]);
    this.set('responseMessage', '');
  }),

  // Character Limit
  charLimit: String(CHARLIMIT),
  charCount: String(CHARLIMIT),
  updateCharLimit: Ember.observer('msg', function() {
    let count = CHARLIMIT - this.get('msg').length;
    this.set('charCount', String(count));
  }),

  // Send message
  readyToSend: Ember.computed.and('validEmail', 'validMsg'),
  responseMessage: '',
  displayResponse: Ember.computed.gte('responseMessage.length', 1),
  actions: {
    sendMessage() {
      const email = this.get('email');
      const message = this.get('msg');

      const newContact = this.store.createRecord('contact', {
        email: email, message: message
      });

      newContact.save().then((response) => {
        this.set('email', '');
        this.set('msg', '');
        this.set('responseMessage', `Thank you! We will reply to you shortly. Your message id: ${response.id}`);
      });
    }
  }

});
