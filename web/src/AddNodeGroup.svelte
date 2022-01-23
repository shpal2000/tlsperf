<script>
    import { ProgressBar } from "carbon-components-svelte";

    export let isActive;
    let Name = '';
    let isError = false;
    let errorMsg = '';
    let errorRows = 1;
    let isProgress = false;

    let nameRegex = new RegExp('^[a-z0-9]+$', 'i');
    let lineRegex = new RegExp('\r?\n');

    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher ();

    function setErrorMsg(msg) {
      errorMsg = msg;
      errorRows = (errorMsg.split(lineRegex)).length;
      if (errorRows == 0){
        errorRows = 1
      } else if (errorRows > 4){
        errorRows = 4;
      }
      isError = true;
    }

    function reset() {
      Name = '';
      isProgress = false;
      errorMsg = '';
      isError = false;
      isActive=false;
      errorRows = 1;
    }

    function setError () {

    }

    async function onAddNodeGroupCancel () {
      reset();
    }

    async function onAddNodeGroupOk () {
      errorMsg = '';
      isError = false;

      Name = Name.trim();
      if (!nameRegex.test(Name))
      {
        isError = true;
        errorMsg = 'Name error:  alphanumeric only';
        errorRows = 1;
      }

      if (!isError) {
        try {
          isProgress = true;
          const res = await fetch ('/api/node_groups', {
            method: 'POST',
            body: JSON.stringify({
              Name
            })
          });
          isProgress = false;

          if (res.ok) {
            const json = await res.json();

            if (json.status == 0){
              dispatch ('addNodeGroupSuccess', {Name: Name});
              reset();
            } else {
              console.log(json);
              setErrorMsg (json.message);
            }
          } else {
            console.log(res);
            setErrorMsg (JSON.stringify(res));
          }
        } catch(e) {
          isProgress = false;
          setErrorMsg (e.toString());
        }
      }
    }
</script>

<div class="modal {isActive ? 'is-active' : ''}">
    <div class="modal-card box">
      <header>
        <p class="modal-card-title">Add Node Folder</p>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="label">Name</label>
          <div class="control">
            <input class="input is-info" type="text" placeholder="Text input" bind:value={Name}>
          </div>
        </div>

        {#if isProgress}
        <div class="field">
          <div class="control">
            <ProgressBar helperText=""/>
          </div>
        </div>
        {/if}

        {#if isError}
          <div class="field">
            <div class="control">
              <textarea class="textarea errmsg" placeholder="" rows="{errorRows}" value={errorMsg} />
            </div>
          </div>          
        {/if}

        <div class="field is-grouped">
          <div class="control">
            <button class="button is-info" on:click={onAddNodeGroupOk}>Add</button>
          </div>
          <div class="control">
            <button class="button is-info is-light" on:click={onAddNodeGroupCancel}>Cancel</button>
          </div>
        </div>
      </section>
    </div>
</div>

<style>
  .errmsg {
    border: none;
    background-color: transparent;
    color: red;
    outline: none;
  }
</style>