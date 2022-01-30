<script>
  import { profileTreeRoot } from '$lib/store.js';

  import { ProgressBar } from "carbon-components-svelte";

  export let isActive;
  let Name;
  let nameError;
  let nameHelp;

  let isError;
  let errorMsg;
  let errorRows;
  let isProgress;

  function resetState() {
    Name = '';
    nameError = false;

    isError = false;
    isProgress = false;

    isActive=false;
  }

  resetState();

  let nameRegex = new RegExp('^[a-z0-9]+$', 'i');
  let lineRegex = new RegExp('\r?\n');

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher ();

  function validateName () {

    if (Name.trim() == ''){
      nameHelp = 'required';
      nameError = true;
    } else if (!nameRegex.test(Name)){
      nameHelp = 'invalid - alphanumeric only';
      nameError = true;
    } else if ($profileTreeRoot.children.find (ng => ng.Name==Name)){
      nameHelp = 'already exist';
      nameError = true;
    } else {
      nameError = false;
    }
  }

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

  async function onAddProfileGroupCancel () {
    resetState ();
  }

  async function onAddProfileGroupOk () {

    validateName ();

    if (!nameError) {
      try {
        errorMsg = '';
        isError = false;
        isProgress = true;
        const res = await fetch ('/api/profile_groups.json', {
          method: 'POST',
          body: JSON.stringify({
            Name
          })
        });
        isProgress = false;

        if (res.ok) {

          const text = await res.text();
            let isJson = true;
            let json = {};
            try {
              json = JSON.parse (text);
            } catch (e) {
              isJson = false;
            }
          
          if (isJson) {
            if (json.status == 0){
              dispatch ('addProfileGroupSuccess', {Name: Name});
              resetState();
            } else {
              console.log(json);
              setErrorMsg (json.message);
            }
          } else {
            isProgress = false;
            setErrorMsg (text); 
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
      <p class="modal-card-title">Add Profile Folder</p>
    </header>
    <section class="modal-card-body">
      <div class="field">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="label">Name</label>
        <div class="control">
          <input class="input {nameError ? 'is-danger' : 'is-info' }" 
            type="text" 
            placeholder="Text input" 
            bind:value={Name}
            on:input={validateName}
            >
          {#if nameError}
            <p class="help">{nameHelp}</p>
          {/if}
        </div>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button class="button is-info" on:click={onAddProfileGroupOk}>Add</button>
        </div>
        <div class="control">
          <button class="button is-info is-light" on:click={onAddProfileGroupCancel}>Cancel</button>
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
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="label">Error</label>
          <div class="control">
            <textarea class="textarea errmsg" placeholder="" rows="{errorRows}" value={errorMsg} readonly/>
          </div>
        </div>          
      {/if}

    </section>
  </div>
</div>

<style>
.errmsg {
  background-color: transparent;
  color: red;
  overflow: auto;
}

</style>