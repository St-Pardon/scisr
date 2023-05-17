const custom = document.getElementById('custom');
const phrase = document.querySelector('.phrase');

custom.onchange = (e) => {
  if (e.target.checked) {
    phrase.style.display = 'block';
  } else {
    phrase.style.display = 'none';
  }
};
