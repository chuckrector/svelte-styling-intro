<script>
    // NOTE(chuck): Example 4: The way Svelte styles things (repaired holistically)
    import ProfileIcon from './ProfileIcon.svelte';

    let useMetropolis = false;
    function toggleFont() {
        useMetropolis = !useMetropolis;
        document.body.classList.toggle('use-metropolis', useMetropolis);
    }
</script>

<svelte:body on:click={toggleFont} />

<nav>
    <ul>
        <li class="logo"><img src="imvu-logo.svg" alt="IMVU logo"></li>
        <li class="menu">{useMetropolis ? 'Metropolis' : 'Gotham'}</li>
        <li class="account">
            <ProfileIcon imageUrl="profile-image-1.webp" />
        </li>
    </ul>
</nav>

<main>
    <section class="left-column">
        <ul class="conversation-list">
            <li class="conversation-list-item">
                <ProfileIcon imageUrl="profile-image-2.webp" size=50 />
                <p class="conversation-list-item-body">
                    <span class="display-name font-medium">Rando</span>
                    <time>Tuesday</time>
                    <span class="conversation-text">This is a test of the emergency broadcasting system. This system was developed by broadcast and cable operators.</span>
                </p>
            </li>

            <li class="conversation-list-item unread">
                <ProfileIcon imageUrl="profile-image-3.webp" size=50 />
                <p class="conversation-list-item-body">
                    <span class="display-name font-medium">Rando</span>
                    <time>Tuesday</time>
                    <span class="conversation-text">This is a test of the emergency broadcasting system. This system was developed by broadcast and cable operators.</span>
                </p>
            </li>

            <li class="conversation-list-item selected">
                <ProfileIcon size=50 imageUrl="profile-image-4.webp" />
                <p class="conversation-list-item-body">
                    <span class="display-name font-medium">Rando</span>
                    <time>Tuesday</time>
                    <span class="conversation-text">This is a test of the emergency broadcasting system. This system was developed by broadcast and cable operators.</span>
                </p>
            </li>
        </ul>
    </section>

    <section class="right-column">
        <ul class="message-list">
            <li class="message-list-item date-divider font-medium">
                <time>Tuesday 2:45 PM</time>
            </li>
            <li class="message-list-item first-in-series">
                <header class="message-list-item-header">
                    <span class="display-name font-medium">Rando</span>
                </header>
                <p class="message-list-item-body">
                    <span class="chat-bubble">
                        <span class="message-text">This is a test of the emergency broadcasting system.</span>
                    </span>
                </p>
            </li>
            <li class="message-list-item">
                <header class="message-list-item-header">
                </header>
                <p class="message-list-item-body">
                    <span class="chat-bubble">
                        <span class="message-text">This system was developed by broadcast and cable operators in voluntary cooperation with the Federal Emergency Management Agency, the Federal Communications Commission and local authorities to keep you informed in the event of an emergency. If this had been an actual emergency an official message would have followed the tone alert you heard at the start of this message.</span>
                    </span>
                </p>
            </li>
            <li class="message-list-item last-in-series">
                <header class="message-list-item-header">
                    <ProfileIcon imageUrl="profile-image-4.webp" />
                </header>
                <p class="message-list-item-body">
                    <span class="chat-bubble">
                        <span class="message-text">No action is required.</span>
                    </span>
                </p>
            </li>
        </ul>

        <div class="chat-bar">
            <textarea placeholder="Say something"></textarea>
        </div>
    </section>

</main>

<style>
    nav {
        letter-spacing: 1px;
        background-color: #404040;
        color: #fff;
        line-height: 50px;
    }
    nav ul {
        display: flex;
    }
    nav {
        padding: 0 15px;
    }
    nav .logo,
    nav .menu,
    nav .account {
        flex-basis: 0;
        flex: calc(100% / 3);
    }
    nav .logo {
        display: grid;
        align-items: center;
    }
    nav .logo img {
        width: 30px;
    }
    nav .menu {
        text-align: center;
    }
    nav .account {
        display: flex;
        justify-content: end;
        align-items: center;
    }

    /* NOTE(chuck): --- Page layout --- */
    main {
        display: grid;
        grid: auto / auto 1fr;
        min-height: calc(100% - 50px);
    }
    .left-column {
        padding: 0 10px 0 0;
    }
    .right-column {
        display: grid;
        grid: 1fr auto / auto;
        max-width: 470px;
        padding: 0 0 0 10px;
    }

    .conversation-list {
        position: relative;
        width: 245px;
    }
    .conversation-list-item {
        position: relative;
        display: grid;
        justify-items: center;
        grid: auto / 65px 1fr;
        min-height: 71px;
        padding: 10px 10px 10px 0;
        border-bottom: 1px solid rgba(0,0,0,.1);
        border-left: 5px solid transparent;
    }
    .conversation-list-item time {
        color: #a8a8a8;
    }
    .conversation-list-item-body {
        display: grid;
        grid-template: "a b"
                       "c c" / 1fr auto;
    }
    .conversation-text {
        grid-area: c;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
    }
    .conversation-list-item.selected {
        background-color: #404040;
        color: #fff;
    }
    .conversation-list-item.unread {
        border-left: 5px solid #deb359;
    }

    .message-list {
        display: flex;
        flex-direction: column;
        justify-content: end;
    }
    .message-list-item {
        display: inline-grid;
        align-items: end;
        grid: ". a"
              ". b" / 37px auto;
        position: relative;
        padding: 0 50px 0 0;
        margin: 0 0 5px 0;
    }
    .message-list-item.first-in-series ~ .message-list-item .message-list-item-header {
        margin: 0;
    }
    .message-list-item.first-in-series header {
        grid-area: a;
    }
    .message-list-item.first-in-series p {
        grid-area: b;
    }
    .message-list-item.last-in-series header {
        margin: 0;
    }
    .message-list-item.date-divider {
        display: block;
        font-size: 10px;
        text-transform: uppercase;
        color: #a8a8a8;
        text-align: center;
        padding: 10px 0 30px;
    }
    .message-list-item header {
        color: #a8a8a8;
        line-height: 1;
        margin: 0 0 5px 0;
    }
    .message-list-item .chat-bubble {
        display: inline-block;
        background: #fff;
        border-radius: 15px;
        padding: 7px 10px;
    }

    .chat-bar {
        background-color: rgba(255, 255, 255, 0.95);
        height: 75px;
        padding: 15px 75px 0 45px;
    }
    .chat-bar textarea {
        border: none;
        width: 100%;
        resize: none;
        border-bottom: 1px solid #eaeaea;
        padding: 0;
        margin: 0;
    }
    .chat-bar textarea:focus {
        outline: none;
    }
    .chat-bar textarea::placeholder {
        color: #a8a8a8;
    }
</style>
