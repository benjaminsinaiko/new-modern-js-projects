document.querySelector('form').addEventListener('submit', event => {
  event.preventDefault();

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
  copiedMessage.classList.remove('hidden');
  setTimeout(() => {
    copiedMessage.classList.add('hidden');
  }, 500);
}
