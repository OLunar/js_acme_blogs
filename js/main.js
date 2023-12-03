// 1. createElemWithText
function createElemWithText(element = 'p', text = '', className) {
    const elem = document.createElement(element);
    elem.textContent = text;
    if (className) elem.className = className;
    return elem;
}
// 2. createSelectOptions
function createSelectOptions(users) {
    if (!users) return undefined;
    const options = users.map(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        return option;
    });
    return options;
}
// 3. toggleCommentSection
function toggleCommentSection(postId) {
    const section = document.querySelector(`section[data-post-id="${postId}"]`);
    if (!section) return null;
    section.classList.toggle('hide');
    return section;
}
// 4. toggleCommentButton
function toggleCommentButton(postId) {
    const button = document.querySelector(`button[data-post-id="${postId}"]`);
    if (!button) return;
    button.textContent = button.textContent === 'Show Comments' ? 'Hide Comments' : 'Show Comments';
    return button;
}
// 5. deleteChildElements
function deleteChildElements(parentElement) {
    let child = parentElement.lastElementChild;
    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
    return parentElement;
}

// 6. addButtonListeners
function addButtonListeners() {
    const buttons = document.querySelectorAll('main button');
    if (!buttons) return;
    buttons.forEach(button => {
        const postId = button.dataset.postId;
        if (postId) {
            button.addEventListener('click', () => toggleComments(event, postId));
        }
    });
    return buttons;
}

// Empty toggleComments function for now
function toggleComments(event, postId) {
    // Logic will be added later
}
// 7. removeButtonListeners
function removeButtonListeners() {
    const buttons = document.querySelectorAll('main button');
    if (!buttons) return;
    buttons.forEach(button => {
        const postId = button.dataset.postId;
        if (postId) {
            button.removeEventListener('click', () => toggleComments(event, postId));
        }
    });
    return buttons;
}
// 8. createComments
function createComments(comments) {
    const fragment = document.createDocumentFragment();
    comments.forEach(comment => {
        const article = document.createElement('article');
        const h3 = createElemWithText('h3', comment.name);
        const p1 = createElemWithText('p', comment.body);
        const p2 = createElemWithText('p', `From: ${comment.email}`);
        article.append(h3, p1, p2);
        fragment.append(article);
    });
    return fragment;
}
// 9. populateSelectMenu
async function populateSelectMenu(users) {
    const selectMenu = document.getElementById('selectMenu');
    const options = await createSelectOptions(users);
    options.forEach(option => selectMenu.append(option));
    return selectMenu;
}
// 10. getUsers
async function getUsers() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}
// 11. getUserPosts
async function getUserPosts(userId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}
// 12. getUser
async function getUser(userId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}
// 13. getPostComments
async function getPostComments(postId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}
// 14. displayComments
async function displayComments(postId) {
    const section = document.createElement('section');
    section.dataset.postId = postId;
    section.classList.add('comments', 'hide');
    const comments = await getPostComments(postId);
    const fragment = createComments(comments);
    section.append(fragment);
    return section;
}
// 15. createPosts
async function createPosts(posts) {
    const fragment = document.createDocumentFragment();
    for (const post of posts) {
        const article = document.createElement('article');
        const h2 = createElemWithText('h2', post.title);
        const p1 = createElemWithText('p', post.body);
        const p2 = createElemWithText('p', `Post ID: ${post.id}`);
        const author = await getUser(post.userId);
        const p3 = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);
        const p4 = createElemWithText('p', author.company.catchPhrase);
        const button = createElemWithText('button', 'Show Comments');
        button.dataset.postId = post.id;
        article.append(h2, p1, p2, p3, p4, button);
        const section = await displayComments(post.id);
        article.append(section);
        fragment.append(article);
    }
    return fragment;
}
// 16. displayPosts
async function displayPosts(posts) {
    const main = document.querySelector('main');
    const element = posts ? await createPosts(posts) : createElemWithText('p', 'No posts found.');
    main.append(element);
    return element;
}
// 17. toggleComments
function comments(event, postId) {
    event.target.listener = true;
    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);
    return [section, button];
}
// 18. refreshPosts
async function refreshPosts(posts) {
    const removeButtons = removeButtonListeners();
    const main = document.querySelector('main');
    const mainElement = deleteChildElements(main);
    const fragment = await displayPosts(posts);
    const addButtons = addButtonListeners();
    return [removeButtons, mainElement, fragment, addButtons];
}
// 19. selectMenuChangeEventHandler
async function selectMenuChangeEventHandler(event) {
    const selectMenu = event.target;
    selectMenu.disabled = true;
    const userId = selectMenu.value || 1;
    const posts = await getUserPosts(userId);
    const refreshPostsArray = await refreshPosts(posts);
    selectMenu.disabled = false;
    return [userId, posts, refreshPostsArray];
}
// 20. initPage
async function initPage() {
    const users = await getUsers();
    const select = await populateSelectMenu(users);
    return [users, select];
}
// 21. initApp
function initApp() {
    initPage();
    const selectMenu = document.getElementById('selectMenu');
    selectMenu.addEventListener('change', selectMenuChangeEventHandler);
}

// Call initApp after the DOM content has loaded
document.addEventListener('DOMContentLoaded', initApp);
