<script>
    export let imageUrl;
    export let size = 30;
</script>

<img src={imageUrl} class="sv-profile-icon size-{size}" alt="Rando">

<style>
    .sv-profile-icon {
        display: block;
        background-color: silver;
        border-radius: 50%;
        object-fit: cover;
        object-position: 50% 0;
    }
    .size-30 {
        width: 30px;
        height: 30px;
    }
    .size-50 {
        width: 50px;
        height: 50px;
    }
</style>
