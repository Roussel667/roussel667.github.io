const btn = document.querySelector('#retourHaut');

window.addEventListener('scroll', () => {    
    if (window.innerWidth > 800 && window.scrollY > 500) {
        btn.classList.add('display');
    } else {
        btn.classList.remove('display');
    }
});

btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


document.getElementById('formulaireContact').addEventListener('submit', function(e) {
    e.preventDefault();

    const nom = document.getElementById('nomUsager');
    const courriel = document.getElementById('courrielUsager');
    const message = document.getElementById('messageUsager');

    const errNom = document.getElementById('erreurNom');
    const errCourriel = document.getElementById('erreurCourriel');
    const errMessage = document.getElementById('erreurMessage');
    const succes = document.getElementById('confirmationSucces');

    errNom.textContent = "";
    errCourriel.textContent = "";
    errMessage.textContent = "";
    succes.classList.add('d-none');

    let valide = true;

    if (nom.value.trim().length < 3) {
        errNom.textContent = "Min. 3 caractères.";
        valide = false;
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(courriel.value)) {
        errCourriel.textContent = "Courriel invalide.";
        valide = false;
    }

    if (message.value.trim().length < 10) {
        errMessage.textContent = "Min. 10 caractères.";
        valide = false;
    }

    if (valide) {
        succes.classList.remove('d-none');
        this.reset();
        setTimeout(() => succes.classList.add('d-none'), 4000);
    }
});


document.querySelector("#propro").addEventListener("click", () => {
    window.scrollTo({ top: 940, behavior: "smooth" });
});


let panier = JSON.parse(localStorage.getItem("panierWooting")) || [];

panier = panier.map(p => ({ ...p, quantite: p.quantite || 1 }));

function afficherPanier() {
    const zoneListe = document.getElementById("listePanier");
    const zoneTotal = document.getElementById("totalPanier");
    const badge = document.getElementById("compteurPanier");

    badge.textContent = panier.reduce((t, p) => t + p.quantite, 0);

    if (panier.length === 0) {
        zoneListe.innerHTML = '<p class="text-center text-muted mt-5">Votre panier est vide.</p>';
        zoneTotal.textContent = "0.00 $";
        return;
    }

    let total = 0;
    zoneListe.innerHTML = "";

    panier.forEach((p, i) => {
        total += p.prix * p.quantite;

        zoneListe.innerHTML += `
        <div class="card bg-secondary bg-opacity-10 border-0 mb-3">
            <div class="card-body p-2 d-flex align-items-center">

                <img src="${p.img}" style="width:60px;height:60px;object-fit:cover;" class="rounded">

                <div class="ms-3 flex-grow-1">
                    <h6 class="mb-0 small text-white">${p.nom}</h6>
                    <span class="text-warning fw-bold">${p.prix.toFixed(2)} $</span>

                    <div class="d-flex align-items-center mt-2">
                        <button class="btn btn-sm btn-outline-light" onclick="changerQuantite(${i}, -1)">−</button>
                        <span class="mx-2 text-white">${p.quantite}</span>
                        <button class="btn btn-sm btn-outline-light" onclick="changerQuantite(${i}, 1)">+</button>
                    </div>
                </div>

                <button class="btn text-danger ms-2" onclick="supprimerProduit(${i})">❌</button>
            </div>
        </div>`;
    });

    zoneTotal.textContent = total.toFixed(2) + " $";
}

function ajouterAuPanier(id, nom, prix, img) {
    const exist = panier.find(p => p.id === id);

    if (exist) {
        exist.quantite++;
    } else {
        panier.push({ id, nom, prix: parseFloat(prix), img, quantite: 1 });
    }

    localStorage.setItem("panierWooting", JSON.stringify(panier));
    afficherPanier();

    new bootstrap.Offcanvas(document.getElementById('panierLateral')).show();
}

function changerQuantite(i, v) {
    panier[i].quantite += v;

    if (panier[i].quantite <= 0) {
        panier.splice(i, 1);
    }

    localStorage.setItem("panierWooting", JSON.stringify(panier));
    afficherPanier();
}

function supprimerProduit(i) {
    panier.splice(i, 1);
    localStorage.setItem("panierWooting", JSON.stringify(panier));
    afficherPanier();
}

function viderPanier() {
    if (confirm("Vider le panier ?")) {
        panier = [];
        localStorage.setItem("panierWooting", JSON.stringify(panier));
        afficherPanier();
    }
}

document.addEventListener("DOMContentLoaded", afficherPanier);


function afficherProduits(cat, idConteneur) {
    fetch("produits.json")
        .then(r => r.json())
        .then(data => {

            const cont = document.getElementById(idConteneur);
            cont.innerHTML = "";

            data.filter(p => p.categorie === cat)
                .forEach(p => {

                cont.innerHTML += `
                <div class="col-6">
                    <div class="product-card text-center border border-secondary p-3 rounded">

                        <img src="${p.image}" class="img-fluid mb-2" style="max-height:120px">

                        <h5 class="text-white">${p.nom}</h5>
                        <p class="text-warning fw-bold">${p.prix} $</p>

                        <button class="btn btn-outline-light btn-sm btn-detail"
                            data-nom="${p.nom}"
                            data-prix="${p.prix}"
                            data-img="${p.image}"
                            data-description="${p.description}">
                            Détails
                        </button>

                        <button class="btn btn-warning btn-sm mt-2"
                            onclick="ajouterAuPanier(${p.id}, '${p.nom}', ${p.prix}, '${p.image}')">
                            Ajouter
                        </button>

                    </div>
                </div>`;
            });
        });
}


document.getElementById('ongletHardware')
    .addEventListener('show.bs.modal', () => afficherProduits("hardware", "hardProduit"));

document.getElementById('ongletAccessoire')
    .addEventListener('show.bs.modal', () => afficherProduits("accessoire", "accessProduit"));

document.getElementById('ongletClavier')
    .addEventListener('show.bs.modal', () => afficherProduits("clavier", "clavierProduit"));

document.getElementById('ongletKeycaps')
    .addEventListener('show.bs.modal', () => afficherProduits("keycaps", "keycapsProduit"));


document.addEventListener("click", function(e) {
    if (e.target.classList.contains("btn-detail")) {

        const b = e.target;

        document.querySelector("#productModal .modal-title").textContent = b.dataset.nom;

        document.getElementById("modal-body").innerHTML = `
        <div class="row align-items-center">
            <div class="col-md-6 text-center">
                <img src="${b.dataset.img}" class="img-fluid rounded shadow">
            </div>
            <div class="col-md-6">
                <h3 class="text-warning">${b.dataset.prix} $</h3>
                <hr>
                <p>${b.dataset.description}</p>
            </div>
        </div>`;

        new bootstrap.Modal(document.getElementById('productModal')).show();
    }
});


document.getElementById("addToCart").addEventListener("click", function() {

    const nom = document.querySelector("#productModal .modal-title").textContent;
    const prix = parseFloat(document.querySelector("#productModal .text-warning").textContent);
    const img = document.querySelector("#productModal img").src;

    ajouterAuPanier(Date.now(), nom, prix, img);

    bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
});