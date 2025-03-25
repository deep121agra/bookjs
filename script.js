// there is all necessary variable are present here
let input = document.getElementById('input');
let search = document.getElementById('search');
let one = 1; // Current page number
let container = document.querySelector('.container');
let sort = document.querySelector('#sort'); // Sort criteria dropdown or button
let increase = document.querySelector('.increase');
let decrease = document.querySelector('.decrease');
let first = []; // it is a array to store a details of all books

// api sei data fetch krne ke liye likha gya hai
async function fetchBooks() {
    try {
        const response = await fetch(`https://api.freeapi.app/api/v1/public/books?page=${one}&limit=10&inc=kind%252Cid%252Cetag%252CvolumeInfo&query=tech`);
        const api = await response.json();

        // purane bale kay hatya gyaa hai
        container.innerHTML = '';
        first = []; // Reset the array
       console.log(api.data.data);
        // it can render the book from tbe api
        api.data.data.forEach((obj) => {
            const book = obj.volumeInfo;
            first.push(book);

            let listItem = document.createElement('li');   // it can use to traslate a data in all our webpage
            listItem.innerHTML = `
                <strong>Title:</strong> ${book.title}<br>
                <strong>Authors:</strong> ${book.authors?.join(', ') || 'N/A'}<br>
                <strong>Publisher:</strong> ${book.publisher || 'N/A'}<br>
                <strong>Published Date:</strong> ${book.publishedDate || 'N/A'}<br>
                <img src="${book.imageLinks?.thumbnail || ''}" alt="${book.title}">
            `;
            container.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching books:', error.message);
    }
}

// next page pr jane kei liye
increase.addEventListener('click', () => {
    if (one < 10) {
        one += 1;
        fetchBooks();
    }
});

// next page pr jane kei liye
decrease.addEventListener('click', () => {
    if (one > 1) {
        one -= 1;
        fetchBooks();
    }
});

// Search functionlaity
search.addEventListener('click', () => {
    const value = input.value.toLowerCase().trim(); // Get user input and trim whitespace

    // it can apply a all filter oon that error
    const foundBooks = first.filter((book) => book.title?.toLowerCase() === value);

    // Display results
    container.innerHTML = '';
    if (foundBooks.length > 0) {
        foundBooks.forEach((book) => {
            let listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>Title:</strong> ${book.title}<br>
                <strong>Authors:</strong> ${book.authors?.join(', ') || 'N/A'}<br>
                <strong>Publisher:</strong> ${book.publisher || 'N/A'}<br>
                <strong>Published Date:</strong> ${book.publishedDate || 'N/A'}<br>
                <img src="${book.imageLinks?.thumbnail || ''}" alt="${book.title}">
            `;
            container.appendChild(listItem);
        });
    } else {
        container.innerHTML = '<li>Book not found</li>';
    }
});

// sort function 
sort.addEventListener('change', () => {
    const sortBy = sort.value; // kise kei basisi pr sort krna hai jaise ki title /date

    if (sortBy === 'title') {
      // agar title kei basis pr kiye hau tau
        first.sort((a, b) => {
            const titleA = a.title?.toLowerCase() || '';
            const titleB = b.title?.toLowerCase() || '';
            return titleA.localeCompare(titleB);
        });
    } else if (sortBy === 'dateofrelase') {
        // Sort books by published date
        first.sort((a, b) => {
            return new Date(a.publishedDate) - new Date(b.publishedDate); // Oldest to newest
        });
    }

     // sort krne kei baad dubra likhne kei liye 
    container.innerHTML = '';
    first.forEach((book) => {
        let listItem = document.createElement('li');
        listItem.innerHTML = `
            <strong>Title:</strong> ${book.title}<br>
            <strong>Authors:</strong> ${book.authors?.join(', ') }<br>
            <strong>Publisher:</strong> ${book.publisher }<br>
            <strong>Published Date:</strong> ${book.publishedDate }<br>
            <img src="${book.imageLinks?.thumbnail }" alt="${book.title}">
        `;
        container.appendChild(listItem);
    });
});

// function decleration to load it on a page
fetchBooks();
