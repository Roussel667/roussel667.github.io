//Bouton Retour en haut
const btn = document.querySelector('#retourHaut');
window.addEventListener('scroll', () => {    
const largeurEcran = window.innerWidth;
const positionScroll = window.scrollY;
if(largeurEcran > 800 && positionScroll > 500) {
    btn.classList.add('display');
}
else {
    btn.classList.remove('display');
}
});
btn.addEventListener('click', () =>{
    window.scrollTo({

        top: 0,
        behavior : 'smooth'
    });
});
//Bouton Retour en haut

//vérification de la section Contact
document.getElementById('formulaireContact').addEventListener('submit', function(evenement) {
    evenement.preventDefault(); 

    
    const champNom = document.getElementById('nomUsager');
    const champCourriel = document.getElementById('courrielUsager');
    const champMessage = document.getElementById('messageUsager');
    const alerteSucces = document.getElementById('confirmationSucces');

    
    const zoneErreurNom = document.getElementById('erreurNom');
    const zoneErreurCourriel = document.getElementById('erreurCourriel');
    const zoneErreurMessage = document.getElementById('erreurMessage');

    let estValide = true;

    // Nettoyage des erreurs précédentes
    zoneErreurNom.textContent = "";
    zoneErreurCourriel.textContent = "";
    zoneErreurMessage.textContent = "";
    alerteSucces.classList.add('d-none');

    // 1. Validation du Nom (min. 3 caractères)
    if (champNom.value.trim().length < 3) {
        zoneErreurNom.textContent = "Le nom doit contenir au moins 3 caractères.";
        estValide = false;
    }

    // 2. Validation du Courriel (Format valide)
    const formatCourriel = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formatCourriel.test(champCourriel.value)) {
        zoneErreurCourriel.textContent = "Veuillez entrer une adresse courriel valide.";
        estValide = false;
    }

    // 3. Validation du Message (min. 10 caractères)
    if (champMessage.value.trim().length < 10) {
        zoneErreurMessage.textContent = "Le message doit contenir au moins 10 caractères.";
        estValide = false;
    }

    // Traitement final
    if (estValide) {
        alerteSucces.classList.remove('d-none'); // Affiche le message de succès
        this.reset(); // Vide le formulaire
        
        // Option : masquer le message de succès après 5 secondes
        setTimeout(() => {
            alerteSucces.classList.add('d-none');
        }, 5000);
    }
}); 
//vérification de la section Contact







// Le panier
// On récupère le panier du stockage local
let panier = JSON.parse(localStorage.getItem("panierWooting")) || [];

function afficherPanier() {
    const zoneListe = document.getElementById("listePanier");
    const zoneTotal = document.getElementById("totalPanier");
    const badge = document.getElementById("compteurPanier");

    badge.textContent = panier.length;

    if (panier.length === 0) {
        zoneListe.innerHTML = '<p class="text-center text-muted mt-5">Votre panier est vide.</p>';
        zoneTotal.textContent = "0.00 $";
        return;
    }

    zoneListe.innerHTML = "";
    let total = 0;

    panier.forEach((produit, index) => {
        total += produit.prix;
        zoneListe.innerHTML += `
            <div class="card bg-secondary bg-opacity-10 border-0 mb-3">
                <div class="card-body p-2">
                    <div class="d-flex align-items-center">
                        <img src="${produit.img}" alt="${produit.nom}" class="rounded" style="width: 60px; height: 60px; object-fit: cover;">
                        <div class="ms-3 flex-grow-1">
                            <h6 class="mb-0 small">${produit.nom}</h6>
                            <span class="text-warning fw-bold">${produit.prix} $</span>
                        </div>
                        <button class="btn text-danger" onclick="supprimerProduit(${index})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>`;
    });

    zoneTotal.textContent = total.toFixed(2) + " $";
}

// Ajouter au panier
function ajouterAuPanier(id, nom, prix, img) {
    panier.push({ id, nom, prix: parseFloat(prix), img });
    localStorage.setItem("panierWooting", JSON.stringify(panier));
    afficherPanier();
    
    // Optionnel : Ouvrir l'offcanvas automatiquement à l'ajout
    const monOffcanvas = new bootstrap.Offcanvas(document.getElementById('panierLateral'));
    monOffcanvas.show();
}

// Supprimer un produit
function supprimerProduit(index) {
    panier.splice(index, 1);
    localStorage.setItem("panierWooting", JSON.stringify(panier));
    afficherPanier();
}

// Vider tout
function viderPanier() {
    if(confirm("Voulez-vous vraiment vider votre panier ?")) {
        panier = [];
        localStorage.setItem("panierWooting", JSON.stringify(panier));
        afficherPanier();
    }
}
// Initialisation au chargement
document.addEventListener("DOMContentLoaded", afficherPanier);
// produit Panier






const conteneurHard = document.getElementById("hardProduit");

// 1. On affiche les produits dans le premier modal (Hardware)
function afficherHardware() {
    fetch("products.json")
        .then(reponse => reponse.json())
        .then(produits => {
            conteneurHard.innerHTML = "";
            const itemsHardware = produits.filter(p => p.categorie === "hardware");

            itemsHardware.forEach(produit => {
                conteneurHard.innerHTML += `
                    <div class="col-6">
                        <div class="product-card text-center border border-secondary p-3 rounded">
                            <img src="${produit.image}" class="img-fluid mb-2" style="max-height: 100px;">
                            <h5 class="text-white">${produit.nom}</h5>
                            <p class="text-warning fw-bold">${produit.prix} $</p>
                            <button class="btn btn-outline-light btn-sm btn-voir-detail" 
                                data-nom="${produit.nom}"
                                data-prix="${produit.prix}"
                                data-img="${produit.image}"
                                data-description="${produit.description}">
                                Voir
                            </button>
                        </div>
                    </div>`;
            });
        });
}

// Écouteur pour ouvrir le premier modal
document.getElementById('ongletHardware').addEventListener('show.bs.modal', afficherHardware);

// 2. Écouteur pour remplir le modal de DÉTAIL (#productModal)
document.addEventListener("click", function(e) {
    // Si on clique sur un bouton qui a la classe "btn-voir-detail"
    if (e.target.classList.contains("btn-voir-detail")) {
        const bouton = e.target;

        // On récupère les infos stockées dans le bouton
        const nom = bouton.dataset.nom;
        const prix = bouton.dataset.prix;
        const img = bouton.dataset.img;
        const desc = bouton.dataset.description;

        // On injecte les infos dans le modal détail
        document.querySelector("#productModal .modal-title").textContent = nom;
        document.getElementById("modal-body").innerHTML = `
            <div class="row align-items-center">
                <div class="col-md-6 text-center">
                    <img src="${img}" class="img-fluid rounded shadow" alt="${nom}">
                </div>
                <div class="col-md-6">
                    <h3 class="text-warning">${prix} $</h3>
                    <hr class="border-secondary">
                    <p class="text-white">${desc}</p>
                </div>
            </div>
        `;

        // Enfin, on affiche le modal détail
        const monModalDetail = new bootstrap.Modal(document.getElementById('productModal'));
        monModalDetail.show();
    }
});

// Écouteur pour le bouton "Ajouter au panier" situé DANS le modal de détails
document.getElementById("addToCart").addEventListener("click", function() {
    // On récupère les infos actuellement affichées dans le modal
    const nom = document.querySelector("#productModal .modal-title").textContent;
    // On récupère le prix (en enlevant le symbole $ et les espaces pour le calcul)
    const prixTexte = document.querySelector("#productModal .text-warning").textContent;
    const prix = parseFloat(prixTexte.replace('$', ''));
    const img = document.querySelector("#productModal img").src;

    // On utilise ta fonction existante
    ajouterAuPanier(Date.now(), nom, prix, img); // Date.now() sert d'ID unique temporaire

    // On ferme le modal de détails après l'ajout
    const modalDetailElement = document.getElementById('productModal');
    const instanceModal = bootstrap.Modal.getInstance(modalDetailElement);
    instanceModal.hide();
});