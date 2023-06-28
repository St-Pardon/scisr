const custom = document.getElementById('custom');
const phrase = document.querySelector('.phrase');
const url = document.querySelector('.s_url');
const copy = document.querySelector('.copy');
const del = document.querySelectorAll('.del');

if (custom) {
  custom.onchange = (e) => {
    if (e.target.checked) {
      phrase.style.display = 'block';
    } else {
      phrase.style.display = 'none';
    }
  };
}

if (copy) {
  copy.onclick = (e) => {
    navigator.clipboard.writeText(url.innerText);

    copy.innerHTML = 'copied';
    copy.style.color = 'green';
    copy.style.fontSize = '1rem';

    setTimeout(() => {
      copy.innerHTML =
        '<img src="assets/copy-svgrepo-com.svg" alt="copy" title="copy" class="icon">';
    }, 3000);
  };
}

del.forEach(
  (item) =>
    (item.onclick = async (e) => {
      try {
        const response = await fetch(`/${item.id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          location.reload();
        } else {
          // Handle error response
        }
      } catch (error) {
        location.reload();
        console.log(error);
      }
    })
);
