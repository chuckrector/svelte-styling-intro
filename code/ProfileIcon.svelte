<script>
    export let imageUrl;
</script>

<img src={imageUrl} class="sv-profile-icon" alt="Rando">

<style>
    .sv-profile-icon {
        width: 30px;
        height: 30px;
        background-color: silver;
        border-radius: 50%;
        object-fit: cover;
        object-position: 50% 0;
    }
</style>
