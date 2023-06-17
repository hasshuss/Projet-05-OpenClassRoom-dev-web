document.addEventListener("DOMContentLoaded", function() {
    var gallery = document.querySelector('.gallery');
    if (gallery) {
        mauGallery(gallery, {
            columns: {
                xs: 1,
                sm: 2,
                md: 3,
                lg: 3,
                xl: 3
            },
            lightBox: true,
            lightboxId: 'myAwesomeLightbox',
            showTags: true,
            tagsPosition: 'top'
        });
    }
});

function mauGallery(element, options) {
    var options = Object.assign({}, mauGallery.defaults, options);
    var tagsCollection = [];
    
    createRowWrapper(element);
    
    if (options.lightBox) {
        createLightBox(element, options.lightboxId, options.navigation);
    }
    
    listeners(element, options);
    
    var galleryItems = element.getElementsByClassName("gallery-item");
    for (var i = 0; i < galleryItems.length; i++) {
        responsiveImageItem(galleryItems[i]);
        moveItemInRowWrapper(galleryItems[i]);
        wrapItemInColumn(galleryItems[i], options.columns);
        
        var theTag = galleryItems[i].dataset.galleryTag;
        if (options.showTags && theTag !== undefined && tagsCollection.indexOf(theTag) === -1) {
            tagsCollection.push(theTag);
        }
    }
    
    if (options.showTags) {
        showItemTags(element, options.tagsPosition, tagsCollection);
    }
    
    element.style.display = 'block';
}

mauGallery.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: null,
    showTags: true,
    tagsPosition: "bottom",
    navigation: true
};

function listeners(element, options) {
    element.addEventListener("click", function(event) {
        var target = event.target;
        if (options.lightBox && target.tagName === "IMG") {
            openLightBox(target, options.lightboxId);
        }
    });
    
    var gallery = document.querySelector('.gallery');
    if (gallery) {
        gallery.addEventListener("click", function(event) {
            var target = event.target;
            if (target.classList.contains("nav-link")) {
                filterByTag(target);
            } else if (target.classList.contains("mg-prev")) {
                prevImage(options.lightboxId);
            } else if (target.classList.contains("mg-next")) {
                nextImage(options.lightboxId);
            }
        });
    }
}

function createRowWrapper(element) {
    var parentWrapper = document.createElement("div");
    parentWrapper.classList.add("gallery-parent-wrapper");
    
    var firstChild = element.firstElementChild;
    if (!firstChild.classList.contains("row")) {
        var rowWrapper = document.createElement("div");
        rowWrapper.classList.add("gallery-items-row", "row");
        parentWrapper.appendChild(rowWrapper);
        element.appendChild(parentWrapper);
    }
}

function wrapItemInColumn(element, columns) {
    var columnClasses = "";
    if (columns.constructor === Number) {
        columnClasses = `col-${Math.ceil(12 / columns)}`;
    } else if (columns.constructor === Object) {
        if (columns.xs) {
            columnClasses += ` col-${Math.ceil(12 / columns.xs)}`;
        }
        if (columns.sm) {
            columnClasses += ` col-sm-${Math.ceil(12 / columns.sm)}`;
        }
        if (columns.md) {
            columnClasses += ` col-md-${Math.ceil(12 / columns.md)}`;
        }
        if (columns.lg) {
            columnClasses += ` col-lg-${Math.ceil(12 / columns.lg)}`;
        }
        if (columns.xl) {
            columnClasses += ` col-xl-${Math.ceil(12 / columns.xl)}`;
        }
    } else {
        console.error(`Columns should be defined as numbers or objects. ${typeof columns} is not supported.`);
    }
    
    var columnWrapper = document.createElement("div");
    columnWrapper.classList.add("item-column", "mb-4");
    columnWrapper.className += columnClasses;
    
    element.parentNode.insertBefore(columnWrapper, element);
    columnWrapper.appendChild(element);
}

function moveItemInRowWrapper(element) {
    var rowWrapper = element.closest(".gallery-items-row");
    if (rowWrapper) {
        rowWrapper.appendChild(element);
    }
}

function responsiveImageItem(element) {
    if (element.tagName === "IMG") {
        element.classList.add("img-fluid");
    }
}

function openLightBox(element, lightboxId) {
    var lightboxImage = document.querySelector(`#${lightboxId} .lightboxImage`);
    if (lightboxImage) {
        lightboxImage.src = element.src;
    }
    
    var lightbox = document.querySelector(`#${lightboxId}`);
    if (lightbox) {
        lightbox.classList.toggle("show");
    }
}

function prevImage(lightboxId) {
    var activeImage = document.querySelector(`#${lightboxId} .lightboxImage[src="${document.querySelector(".lightboxImage").src}"]`);
    var activeTag = document.querySelector(".tags-bar span.active-tag").dataset.imagesToggle;
    var imagesCollection = [];
    
    if (activeTag === "all") {
        var itemColumns = document.querySelectorAll(".item-column");
        for (var i = 0; i < itemColumns.length; i++) {
            var img = itemColumns[i].querySelector("img");
            if (img) {
                imagesCollection.push(img);
            }
        }
    } else {
        var itemColumns = document.querySelectorAll(".item-column");
        for (var i = 0; i < itemColumns.length; i++) {
            var img = itemColumns[i].querySelector("img[data-gallery-tag='" + activeTag + "']");
            if (img) {
                imagesCollection.push(img);
            }
        }
    }
    
    var index = 0;
    for (var i = 0; i < imagesCollection.length; i++) {
        if (activeImage.src === imagesCollection[i].src) {
            index = i;
            break;
        }
    }
    
    var prev = imagesCollection[index - 1] || imagesCollection[imagesCollection.length - 1];
    document.querySelector(".lightboxImage").src = prev.src;
}

function nextImage(lightboxId) {
    var activeImage = document.querySelector(`#${lightboxId} .lightboxImage[src="${document.querySelector(".lightboxImage").src}"]`);
    var activeTag = document.querySelector(".tags-bar span.active-tag").dataset.imagesToggle;
    var imagesCollection = [];
    
    if (activeTag === "all") {
        var itemColumns = document.querySelectorAll(".item-column");
        for (var i = 0; i < itemColumns.length; i++) {
            var img = itemColumns[i].querySelector("img");
            if (img) {
                imagesCollection.push(img);
            }
        }
    } else {
        var itemColumns = document.querySelectorAll(".item-column");
        for (var i = 0; i < itemColumns.length; i++) {
            var img = itemColumns[i].querySelector("img[data-gallery-tag='" + activeTag + "']");
            if (img) {
                imagesCollection.push(img);
            }
        }
    }
    
    var index = 0;
    for (var i = 0; i < imagesCollection.length; i++) {
        if (activeImage.src === imagesCollection[i].src) {
            index = i;
            break;
        }
    }
    
    var next = imagesCollection[index + 1] || imagesCollection[0];
    document.querySelector(".lightboxImage").src = next.src;
}

function createLightBox(gallery, lightboxId, navigation) {
    var lightbox = document.createElement("div");
    lightbox.classList.add("modal", "fade");
    lightbox.id = lightboxId ? lightboxId : "galleryLightbox";
    lightbox.setAttribute("tabindex", "-1");
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-hidden", "true");
    
    var modalDialog = document.createElement("div");
    modalDialog.classList.add("modal-dialog");
    modalDialog.setAttribute("role", "document");
    
    var modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");
    
    var modalBody = document.createElement("div");
    modalBody.classList.add("modal-body");
    
    if (navigation) {
        var prevButton = document.createElement("div");
        prevButton.classList.add("mg-prev");
        prevButton.style.cursor = "pointer";
        prevButton.style.position = "absolute";
        prevButton.style.top = "50%";
        prevButton.style.left = "-15px";
        prevButton.style.background = "white";
        prevButton.textContent = "<";
        
        var lightboxImage = document.createElement("img");
        lightboxImage.classList.add("lightboxImage", "img-fluid");
        lightboxImage.alt = "Contenu de l'image affichée dans la modale au clique";
        
        var nextButton = document.createElement("div");
        nextButton.classList.add("mg-next");
        nextButton.style.cursor = "pointer";
        nextButton.style.position = "absolute";
        nextButton.style.top = "50%";
        nextButton.style.right = "-15px";
        nextButton.style.background = "white";
        nextButton.textContent = ">";
        
        modalBody.appendChild(prevButton);
        modalBody.appendChild(lightboxImage);
        modalBody.appendChild(nextButton);
    } else {
        var span = document.createElement("span");
        span.style.display = "none";
        modalBody.appendChild(span);
    }
    
    modalContent.appendChild(modalBody);
    modalDialog.appendChild(modalContent);
    lightbox.appendChild(modalDialog);
    
    gallery.appendChild(lightbox);
}

function showItemTags(gallery, position, tags) {
    var tagItems = '<li class="nav-item"><span class="nav-link active active-tag" data-images-toggle="all">Tous</span></li>';
    tags.forEach(function(value, index) {
        tagItems += '<li class="nav-item active"><span class="nav-link" data-images-toggle="' + value + '">' + value + '</span></li>';
    });
    
    var tagsRow = document.createElement("ul");
    tagsRow.classList.add("my-4", "tags-bar", "nav", "nav-pills");
    tagsRow.innerHTML = tagItems;
    
    if (position === "bottom") {
        gallery.appendChild(tagsRow);
    } else if (position === "top") {
        gallery.insertBefore(tagsRow, gallery.firstChild);
    } else {
        console.error("Unknown tags position: " + position);
    }
}

function filterByTag(target) {
    if (target.classList.contains("active-tag")) {
        return;
    }
    
    var activeTags = document.querySelectorAll(".active-tag");
    for (var i = 0; i < activeTags.length; i++) {
        activeTags[i].classList.remove("active", "active-tag");
    }
    
    target.classList.add("active-tag");
    var tag = target.dataset.imagesToggle;
    
    var galleryItems = document.querySelectorAll(".gallery-item");
    for (var i = 0; i < galleryItems.length; i++) {
        var itemColumn = galleryItems[i].closest(".item-column");
        if (itemColumn) {
            itemColumn.style.display = "none";
        }
        
        if (tag === "all" || galleryItems[i].dataset.galleryTag === tag) {
            if (itemColumn) {
                itemColumn.style.display = "block";
            }
        }
    }
} 