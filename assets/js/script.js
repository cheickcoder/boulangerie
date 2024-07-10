let slideIndex = 0;
let montant_total = 0;


window.onload = function() {
    const currentPage = window.location.pathname;
    const width = window.screen.width

    if(currentPage.includes("/index.html") || currentPage.substring(1)==""){
        showSlides();
    } else if(currentPage.includes("/boulangerie.html")){
        aficher_produit_choisi();
    } else if(currentPage.includes("/monpanier")){
        aficher_panier(width);
        aficher_commandes(width);
    }
}

document.getElementById('toggleMobileNav').addEventListener('click', function () {
    var nav = document.getElementById('mobile-nav');
    var expanded = this.getAttribute('aria-expanded') === 'true' || false;
    this.setAttribute('aria-expanded', !expanded);
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    if(nav.style.display==='flex'){
        document.getElementById('toggleMobileNav').classList.remove('fa', 'fa-bars');
        document.getElementById('toggleMobileNav').classList.add('fa-solid', 'fa-xmark');
    }else{
        document.getElementById('toggleMobileNav').classList.remove('fa-solid', 'fa-xmark');
        document.getElementById('toggleMobileNav').classList.add('fa', 'fa-bars');
    }
});


function showSlides() {
    let slides = document.querySelectorAll('.slides');
    slides.forEach((slide) => {
        slide.classList.remove('slide-active');
    });
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }
    slides[slideIndex - 1].classList.add('slide-active');
    setTimeout(showSlides, 3000); // Change d'image toutes les 3 secondes
}




function ajouter(id_produit){
    const produit = document.getElementById(id_produit);
    const quantite = produit.children[3].children[1].innerHTML;
    produit.children[3].children[1].innerHTML = parseInt(quantite) + 1;

    const infoproduit = JSON.parse(sessionStorage.getItem(id_produit));
    infoproduit["quantite"] = parseInt(produit.children[3].children[1].innerHTML)
    sessionStorage.setItem(id_produit, JSON.stringify(infoproduit))
}

function retirer(id_produit){
    const produit = document.getElementById(id_produit);
    const quantite = produit.children[3].children[1].innerHTML;

    
    if(parseInt(quantite)>0) {

        produit.children[3].children[1].innerHTML = parseInt(quantite) - 1;        
        if((parseInt(quantite) - 1)==0) {
            const button1 = produit.children[3];
            button1.style.display='none';
            const button = produit.children[2];
            button.style.display='block';
            sessionStorage.removeItem(id_produit);   
        }
    }
}

function ajouter_panier(id_produit){
    const produit = document.getElementById(id_produit);
    const button = produit.children[2];
    button.style.display='none';
    const button1 = produit.children[3];
    button1.style.display='flex';
    const quantite = produit.children[3].children[1].innerHTML;
    produit.children[3].children[1].innerHTML = parseInt(quantite) + 1;

    const montant = produit.children[1].children[1].innerHTML;
    const image = produit.children[0].src;
    const nom = produit.children[1].children[0].innerHTML;

    const infoproduit = {
        montant: parseInt(montant),
        quantite: parseInt(parseInt(quantite) + 1),
        image: image,
        nom: nom
    }
    
    sessionStorage.setItem(id_produit,JSON.stringify(infoproduit));
}

function aficher_produit_choisi(){

    for(let i=0; i<sessionStorage.length;i++){
        const id_produit = sessionStorage.key(i);
        const produit = document.getElementById(id_produit);
        infoproduit = JSON.parse(sessionStorage.getItem(id_produit));

        if(parseInt(infoproduit["quantite"])>0){
            const button = produit.children[2];
            button.style.display='none';
            const button1 = produit.children[3];
            button1.style.display='flex';
            produit.children[3].children[1].innerHTML = infoproduit["quantite"];
        }else{
            const button1 = produit.children[3];
            button1.style.display='none';
            const button = produit.children[2];
            button.style.display='block';
            sessionStorage.removeItem(id_produit)
        }
    }

}


function aficher_panier(width){
    const panier_vide = document.getElementById('panier-vide');
    const panier_non_vide = document.getElementById('section-produits');
    const tbody = document.getElementById("body"); 
    const total = document.getElementById("total");
    total.style.fontWeight='bold';

    if(sessionStorage.length>0){
        panier_vide.style.display = 'none';
        panier_non_vide.style.display = 'flex';

        for(let i=0; i<sessionStorage.length;i++) {
            const id_produit = sessionStorage.key(i)
            aficher_ajouter_panier(id_produit,tbody,width)
        }

        total.innerHTML = "Total :"+montant_total+"GNF";

    }else{
        panier_non_vide.style.display = 'none';
        panier_vide.style.display = 'flex';        
    }
}

function aficher_ajouter_panier(id_produit,parent,width){
    
    const object = JSON.parse(sessionStorage.getItem(id_produit));

    const tr = document.createElement('tr');

    if(parseInt(width)>576){
        /****************IMAGE*****************/
        const td1 = document.createElement('td');
        const img = document.createElement('img');
        img.src = object["image"];
        img.width= 100
        img.height= 100
        td1.appendChild(img)

        /*********************NOM*****************/
        const td2 = document.createElement('td');
        td2.innerHTML = object["nom"]

        /*********************Quantite*****************/
        const td3 = document.createElement('td');

        const divtd3 = document.createElement('div');

        const td3_div = document.createElement('div');

        const button_plus1 = document.createElement('button');
        const icone_plus1 = document.createElement('i');
        icone_plus1.classList='fa-solid fa-plus';
        button_plus1.appendChild(icone_plus1);
        button_plus1.onclick = function(){
            console.log(id_produit)
            ajouter_diminuer_commander("ajouter",id_produit);
        };
        td3_div.appendChild(button_plus1);

        const div1 = document.createElement('div');
        div1.innerHTML = object["quantite"];
        td3_div.appendChild(div1);

        const button_minus1 = document.createElement('button');
        const icone_moins1 = document.createElement('i');
        icone_moins1.classList='fa-solid fa-minus';
        button_minus1.appendChild(icone_moins1);
        button_minus1.onclick = function(){
            ajouter_diminuer_commander("diminuer",id_produit);
        };
        td3_div.appendChild(button_minus1);

        td3_div.style.display = 'flex';
        td3_div.style.width = '100%';
        td3_div.style.gap = '20px';
        td3_div.style.alignItems = 'center';
        td3_div.id="td3_div_"+id_produit;
        td3_div.style.justifyContent = 'center';

        const btndelete = document.createElement('button');
        btndelete.innerHTML = "Supprimer";
        btndelete.onclick = function(){
            annuler_retire_commander(id_produit);
        };
        btndelete.style.color= 'red';
        

        divtd3.style.display = 'flex';
        divtd3.style.width = '100%';
        divtd3.style.gap = '20px';
        divtd3.style.flexDirection = 'column';
        divtd3.style.alignItems = 'center';
        divtd3.style.justifyContent = 'center';

        divtd3.appendChild(td3_div);
        divtd3.appendChild(btndelete);

        td3.appendChild(divtd3);

        /******************TOTAL************************/
        const td4 = document.createElement('td');
        td4.innerHTML = (parseInt(object["quantite"]) * parseInt(object["montant"])) + "GNF"

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
    }else{

        const theader = document.getElementById("thead");
        theader.style.display = "none";

        const td1 = document.createElement('td');
        td1.style.display = "flex";
        td1.style.flexDirection = "column";
        td1.style.justifyContent = "center";
        td1.style.alignItems = "center";
        td1.style.gap = "25px";
        td1.style.margin = "10px";
        td1.style.width = "100%";

        /****************IMAGE*****************/
        const img = document.createElement('img');
        img.src = object["image"];
        img.width= 100
        img.height= 100

        /*********************NOM*****************/
        const div = document.createElement('div');
        div.innerHTML = object["nom"]

        /*********************Quantite*****************/
        const td3 = document.createElement('div');

        const divtd3 = document.createElement('div');

        const td3_div = document.createElement('div');

        const button_plus1 = document.createElement('button');
        const icone_plus1 = document.createElement('i');
        icone_plus1.classList='fa-solid fa-plus';
        button_plus1.appendChild(icone_plus1);
        button_plus1.onclick = function(){
            console.log(id_produit)
            ajouter_diminuer_commander("ajouter",id_produit);
        };
        td3_div.appendChild(button_plus1);

        const div1 = document.createElement('div');
        div1.innerHTML = object["quantite"];
        td3_div.appendChild(div1);

        const button_minus1 = document.createElement('button');
        const icone_moins1 = document.createElement('i');
        icone_moins1.classList='fa-solid fa-minus';
        button_minus1.appendChild(icone_moins1);
        button_minus1.onclick = function(){
            ajouter_diminuer_commander("diminuer",id_produit);
        };
        td3_div.appendChild(button_minus1);

        td3_div.style.display = 'flex';
        td3_div.style.width = '100%';
        td3_div.style.gap = '20px';
        td3_div.style.alignItems = 'center';
        td3_div.id="td3_div_"+id_produit;
        td3_div.style.justifyContent = 'center';

        const btndelete = document.createElement('button');
        btndelete.innerHTML = "Supprimer";
        btndelete.onclick = function(){
            annuler_retire_commander(id_produit);
        };
        btndelete.style.color= 'red';
        

        divtd3.style.display = 'flex';
        divtd3.style.width = '100%';
        divtd3.style.gap = '20px';
        divtd3.style.flexDirection = 'column';
        divtd3.style.alignItems = 'center';
        divtd3.style.justifyContent = 'center';

        divtd3.appendChild(td3_div);
        divtd3.appendChild(btndelete);

        td3.appendChild(divtd3);



        td1.appendChild(img);
        td1.appendChild(div);
        td1.appendChild(td3);

        tr.appendChild(td1);
    }
    

    parent.appendChild(tr);

    montant_total = montant_total + (parseInt(object["quantite"]) * parseInt(object["montant"]))
}


function annuler_retire_commander(idProduit){

    const autorisation = confirm(idProduit==="all"?"Voulez-vous vider le panier?":"Voulez-vous retirer ce produit?");

    console.log(sessionStorage);
    console.log(idProduit)

    if(autorisation===true){
        if(idProduit=="all"){
            sessionStorage.clear();
        }else{
            sessionStorage.removeItem(idProduit);
        }
    }   

    console.log(sessionStorage);

    location.reload();
}

function ajouter_diminuer_commander(action,idProduit){
    const td3Div = document.getElementById("td3_div_"+idProduit);
    const divQuantite = td3Div.childNodes[1]
    let quantite = parseInt(divQuantite.innerHTML);
    let produit = JSON.parse(sessionStorage.getItem(idProduit))
    console.log(produit)

    if(action=="ajouter") {
        quantite += 1;
        
    }else if(action=="diminuer"){
        quantite -= 1;
    }

    if(quantite===0){
        sessionStorage.removeItem(idProduit);       
    }else{
        divQuantite.innerHTML = quantite;
        produit["quantite"] = quantite;
        sessionStorage.setItem(idProduit,JSON.stringify(produit));
    }
    location.reload();
}

function valider_commander(){

    const produits = [];
    const commentaireTextArea = document.getElementById("message");
    const commentaire = commentaireTextArea.value;
    
    for(let i=0; i<sessionStorage.length;i++){
        const id_produit = sessionStorage.key(i);
        const produit = sessionStorage.getItem(id_produit);
        produits.push(JSON.parse(produit));
    }

    const commande = {
        id: localStorage.length+1,
        date: dateTime(),
        commentaire:commentaire,
        produits: produits
    };
    
    localStorage.setItem(localStorage.length,JSON.stringify(commande));
    sessionStorage.clear();
    location.reload();
}


function aficher_commandes(width){
    
    const commande_vide = document.getElementById('commande-vide');
    const commande_non_vide = document.getElementById('section-commandes');
    const tbody = document.getElementById("body-commande"); 
    
    if(localStorage.length>0){

        commande_vide.style.display = "none";
        commande_non_vide.style.display = "flex";

        for(let i=0; i<localStorage.length;i++) {
            const id_commande = localStorage.key(i);
            aficher_ajouter_commande(id_commande,tbody);
        }

    }else{
        commande_vide.style.display = "flex";
        commande_non_vide.style.display = "none";
    }

}

function aficher_ajouter_commande(id_commande,parent){
    
    const object = JSON.parse(localStorage.getItem(id_commande));

    const tr = document.createElement('tr');
    
    /****************IDENTIFIANT*****************/
    const td1 = document.createElement('td');
    td1.innerHTML = object["id"];


    /****************IDENTIFIANT*****************/
    const td2 = document.createElement('td');
    td2.innerHTML = object["date"];

    /****************MONTANT*****************/
    const td3 = document.createElement('td');
    td3.innerHTML = calcul_Montant(object["produits"]);

    /****************PRODUITS*****************/
    const td4 = document.createElement('td');
    const text = document.createElement('span');
    text.style.textDecoration = "underline";
    text.style.cursor = "pointer";
    text.innerHTML = "voir produits"
    text.id='commande'+id_commande;
    text.onclick = function() {
        liste_produit_commande(id_commande);
    }
    td4.appendChild(text);

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);

    parent.appendChild(tr);
}

function calcul_Montant(object){
    let montant = 0;
    for(let i=0; i <object.length; i++){
        montant += parseInt(object[i]["montant"])*parseInt(object[i]["quantite"]);
    }
    return montant;
}

function dateTime(){
    let maintenant = new Date();
    let jour = maintenant.getDate();
    let mois = maintenant.getMonth() + 1;
    let annee = maintenant.getFullYear();
    let heure = maintenant.getHours();
    let minute = maintenant.getMinutes();
    let seconde = maintenant.getSeconds();
    let dateFormatee = `${jour < 10 ? '0' + jour : jour}-${mois < 10 ? '0' + mois : mois}-${annee} ${heure < 10 ? '0' + heure : heure}:${minute < 10 ? '0' + minute : minute}:${seconde < 10 ? '0' + seconde : seconde}`;
    return dateFormatee
}

function liste_produit_commande(id_commande){
    const commandes = JSON.parse(localStorage.getItem(id_commande));
    const produits = commandes["produits"];
    let affichage = ""

    for(let i=0; i<produits.length;i++){    
        affichage += produits[i]["nom"]+" "+produits[i]["quantite"]+" "+produits[i]["montant"] + "\n"
    }

    alert(affichage);
}