import { clearPage, renderPageTitle } from '../../utils/render';
import img from '../../img/No-Image-Found.png';

const Itemlikepage = () => {
  clearPage();
  renderPageTitle('ITEM PAGE');
  itemlikepagefuntion();
};

async function itemlikepagefuntion() {
  const local = await JSON.parse(window.localStorage.getItem('member'));
  const idMember = local.id_membre;

  const request = {
    method: 'GET',
  };
  let response = await fetch(`https://vinced.azurewebsites.net/articles/favorite?id=${idMember}`, request);
  response = await response.json();

  const items = response;
  let html = `
    <section>
      <div class="containeritemlike py-5">
        <h1> Articles I liked </h1> <hr>`;

  items.forEach((article) => {
    const date = new Date(article.date_pub);
    const locale = 'fr-EU';
    const options = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    const formattedDate = date.toLocaleDateString(locale, options);

    html += `
        <div class="card-body">
          <div class="row">
            <div class="col-md-12 col-lg-3 col-xl-3 mb-4 mb-lg-0">
              <div class="bg-image hover-zoom ripple rounded ripple-surface">
                <img src="${img}"
                  class="w-100" />
                <a href="#!">
                  <div class="hover-overlay">
                    <div class="mask" style="background-color: rgba(253, 253, 253, 0.15);"></div>
                  </div>
                </a>
              </div>
            </div>
            <div class="col-md-6 col-lg-6 col-xl-6">
              <h5>ARTICLE : ${article.nom_article}</h5>
              <div class="d-flex flex-row">

              </div>

              <p class="text-truncate mb-4 mb-md-0">${article.description}</p>
              <hr>
              <div> 
                <p>Seller : ${article.prenom_vendeur} ${article.nom_vendeur}</p>
                <p>Status of the sale : ${article.status}</p>
                <p>Publication date : ${formattedDate}<p>
              </div> 
            </div>
            <div class="col-md-6 col-lg-3 col-xl-3 border-sm-start-none border-start">
              <div class="d-flex flex-row align-items-center mb-1">
                <h4 class="mb-1 me-1">${article.prix}???</h4>
              </div>
              <div class="d-flex flex-column mt-4">
                <div id="${article.id_annonce}" class="removeButton btn btn-outline-primary btn-sm mt-2" type="button">
                  Remove from wishlist
                </div>`;
    if (article.id_acheteur) {
      html += `<span class="badge bg-danger" style="width:150px" >SOLD</span>`;
    }
    html += `</div>
            </div>
          </div>
        </div> <hr>`;
  });

  html += `
                </div>
              <div class="row justify-content-center mb-3">
            <div class="col-md-12 col-xl-10">
          </div>
        </div>
      </div>
    </section>`;
  const main = document.querySelector('main');
  main.innerHTML = html;

  const container = document.querySelector('.containeritemlike');
  const removeButtons = container.getElementsByClassName('removeButton');
  const removeButtonsArray = Array.from(removeButtons);

  removeButtonsArray.forEach((removeButton) => {
    removeButton.addEventListener('click', async () => {
      const idAnnonce = removeButton.id;

      const req = {
        method: 'POST',
        body: JSON.stringify({
          id_membre: idMember,
          id_article: idAnnonce,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
      await fetch(`https://vinced.azurewebsites.net/favorites`, req);
      itemlikepagefuntion();
    });
  });
}
export default Itemlikepage;
