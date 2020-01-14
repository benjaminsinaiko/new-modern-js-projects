const { hash } = window.location;

const message = atob(hash.replace('#', ''));

if (message) {
  document.querySelector('#message-form').classList.add('hide');
  document.querySelector('#message-show').classList.remove('hide');

  document.querySelector('h1').innerHTML = message;
}

document.querySelector('form').addEventListener('submit', event => {
  event.preventDefault();

  document.querySelector('#message-form').classList.add('hide');
  document.querySelector('#link-form').classList.remove('hide');

  const input = document.querySelector('#message-input');
  const encrypted = btoa(input.value);

  const linkInput = document.querySelector('#link-input');
  linkInput.value = `${window.location}#${encrypted}`;
  linkInput.select();
});

document.querySelector('.copy').addEventListener('click', () => {
  const linkURL = document.querySelector('#link-input');
  copyText(linkURL);
});

function copyText(textToCopy) {
  textToCopy.select();
  document.execCommand('copy');

  const copiedMessage = document.querySelector('.copied');
  copiedMessage.classList.remove('hide');
  setTimeout(() => {
    copiedMessage.classList.add('hide');
  }, 500);
}
