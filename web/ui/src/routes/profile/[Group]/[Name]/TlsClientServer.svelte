<script>
  import { createEventDispatcher,
   onMount,
   beforeUpdate, 
   onDestroy, 
   tick } from "svelte";
  import { page } from '$app/stores'
  import { routeViewState, getProfileStateKey } from '$lib/store';
  import {goto} from "$app/navigation";
  import { DataTable } from "carbon-components-svelte";
  import "carbon-components-svelte/css/white.css";
  import { ProgressBar, Loading, TextInput, FormGroup, TextArea, Checkbox} from "carbon-components-svelte";
  import Chart from 'chart.js/auto';

  let isLoading = false;
  let showApplyDefault = false;
  let applyIndex = 0;

  let clientInterfaceChecked;
  let serverInterfaceChecked;

  let serverPortChecked;
  let protocolChecked;

  let clientCloseChecked;
  let serverCloseChecked;
  let clientSndBufferChecked;
  let serverSndBufferChecked;
  let clientRcvBufferChecked;
  let serverRcvBufferChecked;

  let clientVersionChecked;
  let serverVersionChecked;
  let clientCiphersChecked;
  let serverCiphersChecked;
  let clientResTypeChecked;
  let serverResTypeChecked;
  let clientResCountChecked;
  let serverResCountChecked;
  let clientCloseNotifyChecked;
  let serverCloseNotifyChecked;

  let maxActionChecked;
  let clientDataLenChecked;
  let serverDataLenChecked;
  let clientStartTlsChecked;
  let serverStartTlsChecked;
  let clientReadChunkChecked;
  let serverReadChunkChecked;
  let clientWriteChunkChecked;
  let serverWriteChunkChecked;

  let serverCertKeyChecked;

  let allPropsChecked;

  let allCsgChecked;
  let csgCheckedList = [];


  function setErrorMsg(action, msg) {
    let lineRegex = new RegExp('\r?\n');

      Profile.errorMsg = action + ' -> '+ msg;
      Profile.errorRows = (Profile.errorMsg.split(lineRegex)).length;
      if (Profile.errorRows == 0){
        Profile.errorRows = 1
      } else if (Profile.errorRows > 4){
        Profile.errorRows = 4;
      }
      Profile.isError = true;
  }


  const dispatch = createEventDispatcher ();

  function validateClientIPs (csg_index) {
    let numRegex = new RegExp('^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/([1-2][0-9]?|3[0-2]?|[4-9])(,(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/([1-2][0-9]?|3[0-2]?|[4-9]))*$', );
    
    const csg = Profile.cs_groups[csg_index];
    const savedCsg = SavedProfile.cs_groups[csg_index];

    csg.client_ipsError = false;
    csg.client_ipsUnsaved = false;
    csg.client_ipsHelp = ''

    if (csg.client_ips.trim() == ''){
      csg.client_ipsHelp = 'required';
      csg.client_ipsError = true;
    } else if (!(csg.client_ips.match(numRegex) && csg.client_ips.match(numRegex)[0] === csg.client_ips)) {
      csg.client_ipsHelp = 'invalid - ip/cidr';
      csg.client_ipsError = true;
    } else if (csg.client_ips != savedCsg.client_ips) {
      csg.client_ipsUnsaved = true;
      csg.client_ipsHelp = "modified"
    }
    
    checkFields();

    Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
  }


  function validateServerIP (csg_index) {
    let numRegex = new RegExp('^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/([1-2][0-9]?|3[0-2]?|[4-9])$', );
    
    const csg = Profile.cs_groups[csg_index];
    const savedCsg = SavedProfile.cs_groups[csg_index];

    csg.server_ipError = false;
    csg.server_ipUnsaved = false;
    csg.server_ipHelp = ''

    if (csg.server_ip.trim() == ''){
      csg.server_ipHelp = 'required';
      csg.server_ipError = true;
    } else if (!(csg.server_ip.match(numRegex) && csg.server_ip.match(numRegex)[0] === csg.server_ip)) {
      csg.server_ipHelp = 'invalid - ip/cidr';
      csg.server_ipError = true;
    } else if (csg.server_ip != savedCsg.server_ip) {
      csg.server_ipUnsaved = true;
      csg.server_ipHelp = "modified"
    }
    
    checkFields();

    Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
  }

  function validateServerPort (csg_index) {
    let numRegex = new RegExp('^[0-9]+$', 'i');
    
    const csg = Profile.cs_groups[csg_index];
    const savedCsg = SavedProfile.cs_groups[csg_index];

    csg.server_portError = false;
    csg.server_portUnsaved = false;
    csg.server_portHelp = ''

    if (csg.server_port.trim() == ''){
      csg.server_portHelp = 'required';
      csg.server_portError = true;
    } else if (!(csg.server_port.match(numRegex) && csg.server_port.match(numRegex)[0] === csg.server_port)) {
      csg.server_portHelp = 'invalid - ip/cidr';
      csg.server_portError = true;
    } else if (csg.server_port != savedCsg.server_port) {
      csg.server_portUnsaved = true;
      csg.server_portHelp = "modified"
    }
    
    checkFields();

    Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
  }

  function validateTransactions () {
    let numRegex = new RegExp('^[0-9]+$', 'i');

    Profile.transactionsError = false;
    Profile.transactionsUnsaved = false;
    Profile.transactionsHelp = ''

    if (Profile.Transactions.trim() == ''){
      Profile.transactionsHelp = 'required';
      Profile.transactionsError = true;
    } else if (!(Profile.Transactions.match(numRegex) && Profile.Transactions.match(numRegex)[0] === Profile.Transactions)){
      Profile.transactionsHelp = 'invalid - number only';
      Profile.transactionsError = true;
    } else if (Profile.Transactions != SavedProfile.Transactions){
      Profile.transactionsUnsaved = true;
      Profile.transactionsHelp = "modified"
    }

    checkFields();
  }

  function validateCps () {
    let numRegex = new RegExp('^[0-9]+$', 'i');

    Profile.cpsError = false;
    Profile.cpsUnsaved = false;
    Profile.cpsHelp = ''
    

    if (Profile.CPS.trim() == ''){
      Profile.cpsHelp = 'required';
      Profile.cpsError = true;
    } else if (!(Profile.CPS.match(numRegex) && Profile.CPS.match(numRegex)[0] === Profile.CPS)){
      Profile.cpsHelp = 'invalid - number only';
      Profile.cpsError = true;
    } else if (Profile.CPS != SavedProfile.CPS){
      Profile.cpsUnsaved = true;
      Profile.cpsHelp = "modified"
    }

    checkFields();
  }

  function validateDataLength () {
    let numRegex = new RegExp('^[0-9]+$', 'i');

    Profile.dataLengthError = false;
    Profile.dataLengthUnsaved = false;
    Profile.dataLengthHelp = ''

    if (Profile.DataLength.trim() == ''){
      Profile.dataLengthHelp = 'required';
      Profile.dataLengthError = true;
    } else if (!(Profile.DataLength.match(numRegex) && Profile.DataLength.match(numRegex)[0] === Profile.DataLength)){
      Profile.dataLengthHelp = 'invalid - number only';
      Profile.dataLengthError = true;
    } else if (Profile.DataLength != SavedProfile.DataLength){
      Profile.dataLengthUnsaved = true;
      Profile.dataLengthHelp = "modified"
    }

    checkFields();
  }

  function validateMaxPipeline () {
    let numRegex = new RegExp('^[0-9]+$', 'i');

    Profile.maxPipelineError = false;
    Profile.maxPipelineUnsaved = false;
    Profile.maxPipelineHelp = ''

    if (Profile.MaxPipeline.trim() == ''){
      Profile.maxPipelineHelp = 'required';
      Profile.maxPipelineError = true;
    } else if (!(Profile.MaxPipeline.match(numRegex) && Profile.MaxPipeline.match(numRegex)[0] === Profile.MaxPipeline)){
      Profile.maxPipelineHelp = 'invalid - number only';
      Profile.maxPipelineError = true;
    } else if (Profile.MaxPipeline != SavedProfile.MaxPipeline){
      Profile.maxPipelineUnsaved = true;
      Profile.maxPipelineHelp = "modified"
    }

    checkFields();
  }

  function validateClientIface (csg_index) {
    let numRegex = new RegExp('^[a-z0-9]+:[a-z0-9]+$', 'i');

    const csg = Profile.cs_groups[csg_index];
    const savedCsg = SavedProfile.cs_groups[csg_index];

    csg.client_ifaceError = false;
    csg.client_ifaceUnsaved = false;
    csg.client_ifaceHelp = ''

    if (csg.client_iface.trim() == ''){
      csg.client_ifaceHelp = 'required';
      csg.client_ifaceError = true;
    } else if (!(csg.client_iface.match(numRegex) && csg.client_iface.match(numRegex)[0] === csg.client_iface)) {
      csg.client_ifaceHelp = 'invalid - iface';
      csg.client_ifaceError = true;
    } else if (csg.client_iface != savedCsg.client_iface) {
      csg.client_ifaceUnsaved = true;
      csg.client_ifaceHelp = "modified"
    }
    
    checkFields();

    Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
  }

  function validateServerIface (csg_index) {
    let numRegex = new RegExp('^[a-z0-9]+:[a-z0-9]+$', 'i');

    const csg = Profile.cs_groups[csg_index];
    const savedCsg = SavedProfile.cs_groups[csg_index];

    csg.server_ifaceError = false;
    csg.server_ifaceUnsaved = false;
    csg.server_ifaceHelp = ''

    if (csg.server_iface.trim() == ''){
      csg.server_ifaceHelp = 'required';
      csg.server_ifaceError = true;
    } else if (!(csg.server_iface.match(numRegex) && csg.server_iface.match(numRegex)[0] === csg.server_iface)) {
      csg.server_ifaceHelp = 'invalid - iface';
      csg.server_ifaceError = true;
    } else if (csg.server_iface != savedCsg.server_iface) {
      csg.server_ifaceUnsaved = true;
      csg.server_ifaceHelp = "modified"
    }
    
    checkFields();

    Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
  }

  function validateProtocol (csg_index) {
    const csg = Profile.cs_groups[csg_index];
    const savedCsg = SavedProfile.cs_groups[csg_index];
    
    csg.server_sslError = false;
    csg.server_sslUnsaved = false;
    csg.server_sslHelp = ''

    if (csg.server_ssl.trim() == ''){
      csg.server_sslHelp = 'required';
      csg.server_sslError = true;
    } else if (!(csg.server_ssl == 'TCP' || csg.server_ssl == 'SSL')) {
      csg.server_sslHelp = 'options - TCP | SSL';
      csg.server_sslError = true;
    } else if (csg.server_ssl != savedCsg.server_ssl) {
      csg.server_sslUnsaved = true;
      csg.server_sslHelp = "modified";
    }

    checkFields();

    Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
  }
  
  function validateClientTcpClose (csg_index) {
    const csg = Profile.cs_groups[csg_index];
    const savedCsg = SavedProfile.cs_groups[csg_index];
    
    csg.client_tcp_close_typeError = false;
    csg.client_tcp_close_typeUnsaved = false;
    csg.client_tcp_close_typeHelp = ''

    if (csg.client_tcp_close_type.trim() == ''){
      csg.client_tcp_close_typeHelp = 'required';
      csg.client_tcp_close_typeError = true;
    } else if (!(csg.client_tcp_close_type == 'FIN' || csg.client_tcp_close_type == 'RST')) {
      csg.client_tcp_close_typeHelp = 'options - FIN | RST';
      csg.client_tcp_close_typeError = true;
    } else if (csg.client_tcp_close_type != savedCsg.client_tcp_close_type) {
      csg.client_tcp_close_typeUnsaved = true;
      csg.client_tcp_close_typeHelp = "modified";
    }

    checkFields();

    Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
  }

  function validateServerTcpClose (csg_index) {
    const csg = Profile.cs_groups[csg_index];
    const savedCsg = SavedProfile.cs_groups[csg_index];
    
    csg.server_tcp_close_typeError = false;
    csg.server_tcp_close_typeUnsaved = false;
    csg.server_tcp_close_typeHelp = ''

    if (csg.server_tcp_close_type.trim() == ''){
      csg.server_tcp_close_typeHelp = 'required';
      csg.server_tcp_close_typeError = true;
    } else if (!(csg.server_tcp_close_type == 'FIN' || csg.server_tcp_close_type == 'RST')) {
      csg.server_tcp_close_typeHelp = 'options - FIN | RST';
      csg.server_tcp_close_typeError = true;
    } else if (csg.server_tcp_close_type != savedCsg.server_tcp_close_type) {
      csg.server_tcp_close_typeUnsaved = true;
      csg.server_tcp_close_typeHelp = "modified";
    }

    checkFields();

    Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
  }

  function validateClientSndBuffer (csg_index) {
    let numRegex = new RegExp('^[0-9]+$', 'i');

    const csg = Profile.cs_groups[csg_index];
    const savedCsg = SavedProfile.cs_groups[csg_index];

    csg.client_tcp_snd_buff_lenError = false;
    csg.client_tcp_snd_buff_lenUnsaved = false;
    csg.client_tcp_snd_buff_lenHelp = ''

    if (csg.client_tcp_snd_buff_len.trim() == ''){
      csg.client_tcp_snd_buff_lenHelp = 'required';
      csg.client_tcp_snd_buff_lenError = true;
    } else if (!(csg.client_tcp_snd_buff_len.match(numRegex) && csg.client_tcp_snd_buff_len.match(numRegex)[0] === csg.client_tcp_snd_buff_len)) {
      csg.client_tcp_snd_buff_lenHelp = 'invalid - number only';
      csg.client_tcp_snd_buff_lenError = true;
    } else if (csg.client_tcp_snd_buff_len != savedCsg.client_tcp_snd_buff_len) {
      csg.client_tcp_snd_buff_lenUnsaved = true;
      csg.client_tcp_snd_buff_lenHelp = "modified"
    }
    
    checkFields();

    Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
  }

  function validateServerSndBuffer (csg_index) {
    let numRegex = new RegExp('^[0-9]+$', 'i');

    const csg = Profile.cs_groups[csg_index];
    const savedCsg = SavedProfile.cs_groups[csg_index];

    csg.server_tcp_snd_buff_lenError = false;
    csg.server_tcp_snd_buff_lenUnsaved = false;
    csg.server_tcp_snd_buff_lenHelp = ''

    if (csg.server_tcp_snd_buff_len.trim() == ''){
      csg.server_tcp_snd_buff_lenHelp = 'required';
      csg.server_tcp_snd_buff_lenError = true;
    } else if (!(csg.server_tcp_snd_buff_len.match(numRegex) && csg.server_tcp_snd_buff_len.match(numRegex)[0] === csg.server_tcp_snd_buff_len)) {
      csg.server_tcp_snd_buff_lenHelp = 'invalid - number only';
      csg.server_tcp_snd_buff_lenError = true;
    } else if (csg.server_tcp_snd_buff_len != savedCsg.server_tcp_snd_buff_len) {
      csg.server_tcp_snd_buff_lenUnsaved = true;
      csg.server_tcp_snd_buff_lenHelp = "modified"
    }
    
    checkFields();

    Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
  }

  function validateClientRcvBuffer (csg_index) {
    let numRegex = new RegExp('^[0-9]+$', 'i');

    const csg = Profile.cs_groups[csg_index];
    const savedCsg = SavedProfile.cs_groups[csg_index];

    csg.client_tcp_rcv_buff_lenError = false;
    csg.client_tcp_rcv_buff_lenUnsaved = false;
    csg.client_tcp_rcv_buff_lenHelp = ''

    if (csg.client_tcp_rcv_buff_len.trim() == ''){
      csg.client_tcp_rcv_buff_lenHelp = 'required';
      csg.client_tcp_rcv_buff_lenError = true;
    } else if (!(csg.client_tcp_rcv_buff_len.match(numRegex) && csg.client_tcp_rcv_buff_len.match(numRegex)[0] === csg.client_tcp_rcv_buff_len)) {
      csg.client_tcp_rcv_buff_lenHelp = 'invalid - number only';
      csg.client_tcp_rcv_buff_lenError = true;
    } else if (csg.client_tcp_rcv_buff_len != savedCsg.client_tcp_rcv_buff_len) {
      csg.client_tcp_rcv_buff_lenUnsaved = true;
      csg.client_tcp_rcv_buff_lenHelp = "modified"
    }
    
    checkFields();

    Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
  }  

  function validateServerRcvBuffer (csg_index) {
    let numRegex = new RegExp('^[0-9]+$', 'i');

    const csg = Profile.cs_groups[csg_index];
    const savedCsg = SavedProfile.cs_groups[csg_index];

    csg.server_tcp_rcv_buff_lenError = false;
    csg.server_tcp_rcv_buff_lenUnsaved = false;
    csg.server_tcp_rcv_buff_lenHelp = ''

    if (csg.server_tcp_rcv_buff_len.trim() == ''){
      csg.server_tcp_rcv_buff_lenHelp = 'required';
      csg.server_tcp_rcv_buff_lenError = true;
    } else if (!(csg.server_tcp_rcv_buff_len.match(numRegex) && csg.server_tcp_rcv_buff_len.match(numRegex)[0] === csg.server_tcp_rcv_buff_len)) {
      csg.server_tcp_rcv_buff_lenHelp = 'invalid - number only';
      csg.server_tcp_rcv_buff_lenError = true;
    } else if (csg.server_tcp_rcv_buff_len != savedCsg.server_tcp_rcv_buff_len) {
      csg.server_tcp_rcv_buff_lenUnsaved = true;
      csg.server_tcp_rcv_buff_lenHelp = "modified"
    }
    
    checkFields();

    Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
  }  

  function validateClientTlsVersion (csg_index) {
    const csg = Profile.cs_groups[csg_index];
    const savedCsg = SavedProfile.cs_groups[csg_index];
    
    csg.client_tls_versionError = false;
    csg.client_tls_versionUnsaved = false;
    csg.client_tls_versionHelp = ''

    if (csg.client_tls_version.trim() == ''){
      csg.client_tls_versionHelp = 'required - sslv3|tls1|tls1_1|tls1_2|tls1_3|tls_all';
      csg.client_tls_versionError = true;
    } else if (!(csg.client_tls_version == 'sslv3' 
                || csg.client_tls_version == 'tls1'
                || csg.client_tls_version == 'tls1_1'
                || csg.client_tls_version == 'tls1_2'
                || csg.client_tls_version == 'tls1_3'
                || csg.client_tls_version == 'tls_all')) {
      csg.client_tls_versionHelp = 'options - sslv3|tls1|tls1_1|tls1_2|tls1_3|tls_all';
      csg.client_tls_versionError = true;
    } else if (csg.client_tls_version != savedCsg.client_tls_version) {
      csg.client_tls_versionUnsaved = true;
      csg.client_tls_versionHelp = "modified";
    }

    checkFields();

    Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
  }


  function validateServerTlsVersion (csg_index) {
    const csg = Profile.cs_groups[csg_index];
    const savedCsg = SavedProfile.cs_groups[csg_index];
    
    csg.server_tls_versionError = false;
    csg.server_tls_versionUnsaved = false;
    csg.server_tls_versionHelp = ''

    if (csg.server_tls_version.trim() == ''){
      csg.server_tls_versionHelp = 'required - sslv3|tls1|tls1_1|tls1_2|tls1_3|tls_all';
      csg.server_tls_versionError = true;
    } else if (!(csg.server_tls_version == 'sslv3' 
                || csg.server_tls_version == 'tls1'
                || csg.server_tls_version == 'tls1_1'
                || csg.server_tls_version == 'tls1_2'
                || csg.server_tls_version == 'tls1_3'
                || csg.server_tls_version == 'tls_all')) {
      csg.server_tls_versionHelp = 'options - sslv3|tls1|tls1_1|tls1_2|tls1_3|tls_all';
      csg.server_tls_versionError = true;
    } else if (csg.server_tls_version != savedCsg.server_tls_version) {
      csg.server_tls_versionUnsaved = true;
      csg.server_tls_versionHelp = "modified";
    }

    checkFields();

    Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
  }  

  function validateClientCipher (csg_index) {
    const csg = Profile.cs_groups[csg_index];
    const savedCsg = SavedProfile.cs_groups[csg_index];
    
    csg.client_tls_cipherError = false;
    csg.client_tls_cipherUnsaved = false;
    csg.client_tls_cipherHelp = ''

    if (csg.client_tls_cipher.trim() == ''){
      csg.client_tls_cipherHelp = 'required';
      csg.client_tls_cipherError = true;
    } else if (csg.client_tls_cipher != savedCsg.client_tls_cipher) {
      csg.client_tls_cipherUnsaved = true;
      csg.client_tls_cipherHelp = "modified";
    }

    checkFields();

    Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
  }

  function validateServerCipher (csg_index) {
    const csg = Profile.cs_groups[csg_index];
    const savedCsg = SavedProfile.cs_groups[csg_index];
    
    csg.server_tls_cipherError = false;
    csg.server_tls_cipherUnsaved = false;
    csg.server_tls_cipherHelp = ''

    if (csg.server_tls_cipher.trim() == ''){
      csg.server_tls_cipherHelp = 'required';
      csg.server_tls_cipherError = true;
    } else if (csg.server_tls_cipher != savedCsg.server_tls_cipher) {
      csg.server_tls_cipherUnsaved = true;
      csg.server_tls_cipherHelp = "modified";
    }

    checkFields();

    Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
  }

  function validateMaxActiveConn (csg_index) {
    let numRegex = new RegExp('^[0-9]+$', 'i');

    const csg = Profile.cs_groups[csg_index];
    const savedCsg = SavedProfile.cs_groups[csg_index];

    csg.max_active_conn_countError = false;
    csg.max_active_conn_countUnsaved = false;
    csg.max_active_conn_countHelp = ''

    if (csg.max_active_conn_count.trim() == ''){
      csg.max_active_conn_countHelp = 'required';
      csg.max_active_conn_countError = true;
    } else if (!(csg.max_active_conn_count.match(numRegex) && csg.max_active_conn_count.match(numRegex)[0] === csg.max_active_conn_count)) {
      csg.max_active_conn_countHelp = 'invalid - number only';
      csg.max_active_conn_countError = true;
    } else if (csg.max_active_conn_count != savedCsg.max_active_conn_count) {
      csg.max_active_conn_countUnsaved = true;
      csg.max_active_conn_countHelp = "modified"
    }
    
    checkFields();

    Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
  }  


  function validateClientDataLen (csg_index) {
    let numRegex = new RegExp('^[0-9]+$', 'i');

    const csg = Profile.cs_groups[csg_index];
    const savedCsg = SavedProfile.cs_groups[csg_index];

    csg.cs_data_lenError = false;
    csg.cs_data_lenUnsaved = false;
    csg.cs_data_lenHelp = ''

    if (csg.cs_data_len.trim() == ''){
      csg.cs_data_lenHelp = 'required';
      csg.cs_data_lenError = true;
    } else if (!(csg.cs_data_len.match(numRegex) && csg.cs_data_len.match(numRegex)[0] === csg.cs_data_len)) {
      csg.cs_data_lenHelp = 'invalid - number only';
      csg.cs_data_lenError = true;
    } else if (csg.cs_data_len != savedCsg.cs_data_len) {
      csg.cs_data_lenUnsaved = true;
      csg.cs_data_lenHelp = "modified"
    }
    
    checkFields();

    Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
  } 

  function validateServerDataLen (csg_index) {
    let numRegex = new RegExp('^[0-9]+$', 'i');

    const csg = Profile.cs_groups[csg_index];
    const savedCsg = SavedProfile.cs_groups[csg_index];

    csg.sc_data_lenError = false;
    csg.sc_data_lenUnsaved = false;
    csg.sc_data_lenHelp = ''

    if (csg.sc_data_len.trim() == ''){
      csg.sc_data_lenHelp = 'required';
      csg.sc_data_lenError = true;
    } else if (!(csg.sc_data_len.match(numRegex) && csg.sc_data_len.match(numRegex)[0] === csg.sc_data_len)) {
      csg.sc_data_lenHelp = 'invalid - number only';
      csg.sc_data_lenError = true;
    } else if (csg.sc_data_len != savedCsg.sc_data_len) {
      csg.sc_data_lenUnsaved = true;
      csg.sc_data_lenHelp = "modified"
    }
    
    checkFields();

    Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
  } 

  function validateClientStartTlsLen (csg_index) {
    let numRegex = new RegExp('^[0-9]+$', 'i');

    const csg = Profile.cs_groups[csg_index];
    const savedCsg = SavedProfile.cs_groups[csg_index];

    csg.cs_starttls_lenError = false;
    csg.cs_starttls_lenUnsaved = false;
    csg.cs_starttls_lenHelp = ''

    if (csg.cs_starttls_len.trim() == ''){
      csg.cs_starttls_lenHelp = 'required';
      csg.cs_starttls_lenError = true;
    } else if (!(csg.cs_starttls_len.match(numRegex) && csg.cs_starttls_len.match(numRegex)[0] === csg.cs_starttls_len)) {
      csg.cs_starttls_lenHelp = 'invalid - number only';
      csg.cs_starttls_lenError = true;
    } else if (csg.cs_starttls_len != savedCsg.cs_starttls_len) {
      csg.cs_starttls_lenUnsaved = true;
      csg.cs_starttls_lenHelp = "modified"
    }
    
    checkFields();

    Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
  } 

  function validateServerStartTlsLen (csg_index) {
    let numRegex = new RegExp('^[0-9]+$', 'i');

    const csg = Profile.cs_groups[csg_index];
    const savedCsg = SavedProfile.cs_groups[csg_index];

    csg.sc_starttls_lenError = false;
    csg.sc_starttls_lenUnsaved = false;
    csg.sc_starttls_lenHelp = ''

    if (csg.sc_starttls_len.trim() == ''){
      csg.sc_starttls_lenHelp = 'required';
      csg.sc_starttls_lenError = true;
    } else if (!(csg.sc_starttls_len.match(numRegex) && csg.sc_starttls_len.match(numRegex)[0] === csg.sc_starttls_len)) {
      csg.sc_starttls_lenHelp = 'invalid - number only';
      csg.sc_starttls_lenError = true;
    } else if (csg.sc_starttls_len != savedCsg.sc_starttls_len) {
      csg.sc_starttls_lenUnsaved = true;
      csg.sc_starttls_lenHelp = "modified"
    }
    
    checkFields();

    Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
  } 

  function validateClientReadChunk (csg_index) {
    let numRegex = new RegExp('^[0-9]+$', 'i');

    const csg = Profile.cs_groups[csg_index];
    const savedCsg = SavedProfile.cs_groups[csg_index];

    csg.client_read_chunk_lenError = false;
    csg.client_read_chunk_lenUnsaved = false;
    csg.client_read_chunk_lenHelp = ''

    if (csg.client_read_chunk_len.trim() == ''){
      csg.client_read_chunk_lenHelp = 'required';
      csg.client_read_chunk_lenError = true;
    } else if (!(csg.client_read_chunk_len.match(numRegex) && csg.client_read_chunk_len.match(numRegex)[0] === csg.client_read_chunk_len)) {
      csg.client_read_chunk_lenHelp = 'invalid - number only';
      csg.client_read_chunk_lenError = true;
    } else if (csg.client_read_chunk_len != savedCsg.client_read_chunk_len) {
      csg.client_read_chunk_lenUnsaved = true;
      csg.client_read_chunk_lenHelp = "modified"
    }
    
    checkFields();

    Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
  } 

  function validateServerReadChunk (csg_index) {
    let numRegex = new RegExp('^[0-9]+$', 'i');

    const csg = Profile.cs_groups[csg_index];
    const savedCsg = SavedProfile.cs_groups[csg_index];

    csg.server_read_chunk_lenError = false;
    csg.server_read_chunk_lenUnsaved = false;
    csg.server_read_chunk_lenHelp = ''

    if (csg.server_read_chunk_len.trim() == ''){
      csg.server_read_chunk_lenHelp = 'required';
      csg.server_read_chunk_lenError = true;
    } else if (!(csg.server_read_chunk_len.match(numRegex) && csg.server_read_chunk_len.match(numRegex)[0] === csg.server_read_chunk_len)) {
      csg.server_read_chunk_lenHelp = 'invalid - number only';
      csg.server_read_chunk_lenError = true;
    } else if (csg.server_read_chunk_len != savedCsg.server_read_chunk_len) {
      csg.server_read_chunk_lenUnsaved = true;
      csg.server_read_chunk_lenHelp = "modified"
    }
    
    checkFields();

    Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
  } 

  function validateClientWriteChunk (csg_index) {
    let numRegex = new RegExp('^[0-9]+$', 'i');

    const csg = Profile.cs_groups[csg_index];
    const savedCsg = SavedProfile.cs_groups[csg_index];

    csg.client_write_chunk_lenError = false;
    csg.client_write_chunk_lenUnsaved = false;
    csg.client_write_chunk_lenHelp = ''

    if (csg.client_write_chunk_len.trim() == ''){
      csg.client_write_chunk_lenHelp = 'required';
      csg.client_write_chunk_lenError = true;
    } else if (!(csg.client_write_chunk_len.match(numRegex) && csg.client_write_chunk_len.match(numRegex)[0] === csg.client_write_chunk_len)) {
      csg.client_write_chunk_lenHelp = 'invalid - number only';
      csg.client_write_chunk_lenError = true;
    } else if (csg.client_write_chunk_len != savedCsg.client_write_chunk_len) {
      csg.client_write_chunk_lenUnsaved = true;
      csg.client_write_chunk_lenHelp = "modified"
    }
    
    checkFields();

    Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
  } 

  function validateServerWriteChunk (csg_index) {
    let numRegex = new RegExp('^[0-9]+$', 'i');

    const csg = Profile.cs_groups[csg_index];
    const savedCsg = SavedProfile.cs_groups[csg_index];

    csg.server_write_chunk_lenError = false;
    csg.server_write_chunk_lenUnsaved = false;
    csg.server_write_chunk_lenHelp = ''

    if (csg.server_write_chunk_len.trim() == ''){
      csg.server_write_chunk_lenHelp = 'required';
      csg.server_write_chunk_lenError = true;
    } else if (!(csg.server_write_chunk_len.match(numRegex) && csg.server_write_chunk_len.match(numRegex)[0] === csg.server_write_chunk_len)) {
      csg.server_write_chunk_lenHelp = 'invalid - number only';
      csg.server_write_chunk_lenError = true;
    } else if (csg.server_write_chunk_len != savedCsg.server_write_chunk_len) {
      csg.server_write_chunk_lenUnsaved = true;
      csg.server_write_chunk_lenHelp = "modified"
    }
    
    checkFields();

    Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
  } 

  function validateClientResType (csg_index) {
    const csg = Profile.cs_groups[csg_index];
    const savedCsg = SavedProfile.cs_groups[csg_index];
    
    csg.client_resumption_typeError = false;
    csg.client_resumption_typeUnsaved = false;
    csg.client_resumption_typeHelp = ''

    if (csg.client_resumption_type.trim() == ''){
      csg.client_resumption_typeHelp = 'required - SESSID | TICKET | ALL | NONE';
      csg.client_resumption_typeError = true;
    } else if (!(csg.client_resumption_type == 'SESSID'
                || csg.client_resumption_type == 'TICKET'
                || csg.client_resumption_type == 'ALL'
                || csg.client_resumption_type == 'NONE')) {
      csg.client_resumption_typeHelp = 'options - SESSID | TICKET | ALL | NONE';
      csg.client_resumption_typeError = true;
    } else if (csg.client_resumption_type != savedCsg.client_resumption_type) {
      csg.client_resumption_typeUnsaved = true;
      csg.client_resumption_typeHelp = "modified";
    }

    checkFields();

    Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
  }

  function validateClientResCount (csg_index) {
    let numRegex = new RegExp('^[0-9]+$', 'i');

    const csg = Profile.cs_groups[csg_index];
    const savedCsg = SavedProfile.cs_groups[csg_index];

    csg.client_resumption_countError = false;
    csg.client_resumption_countUnsaved = false;
    csg.client_resumption_countHelp = ''

    if (csg.client_resumption_count.trim() == ''){
      csg.client_resumption_countHelp = 'required';
      csg.client_resumption_countError = true;
    } else if (!(csg.client_resumption_count.match(numRegex) && csg.client_resumption_count.match(numRegex)[0] === csg.client_resumption_count)) {
      csg.client_resumption_countHelp = 'invalid - number only';
      csg.client_resumption_countError = true;
    } else if (csg.client_resumption_count != savedCsg.client_resumption_count) {
      csg.client_resumption_countUnsaved = true;
      csg.client_resumption_countHelp = "modified"
    }
    
    checkFields();

    Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
  } 

  function validateServerResType (csg_index) {
    const csg = Profile.cs_groups[csg_index];
    const savedCsg = SavedProfile.cs_groups[csg_index];
    
    csg.server_resumption_typeError = false;
    csg.server_resumption_typeUnsaved = false;
    csg.server_resumption_typeHelp = ''

    if (csg.server_resumption_type.trim() == ''){
      csg.server_resumption_typeHelp = 'required - SESSID | TICKET | ALL | NONE';
      csg.server_resumption_typeError = true;
    } else if (!(csg.server_resumption_type == 'SESSID'
                || csg.server_resumption_type == 'TICKET'
                || csg.server_resumption_type == 'ALL'
                || csg.server_resumption_type == 'NONE')) {
      csg.server_resumption_typeHelp = 'options - SESSID | TICKET | ALL | NONE';
      csg.server_resumption_typeError = true;
    } else if (csg.server_resumption_type != savedCsg.server_resumption_type) {
      csg.server_resumption_typeUnsaved = true;
      csg.server_resumption_typeHelp = "modified";
    }

    checkFields();

    Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
  }

  function validateServerResCount (csg_index) {
    let numRegex = new RegExp('^[0-9]+$', 'i');

    const csg = Profile.cs_groups[csg_index];
    const savedCsg = SavedProfile.cs_groups[csg_index];

    csg.server_resumption_countError = false;
    csg.server_resumption_countUnsaved = false;
    csg.server_resumption_countHelp = ''

    if (csg.server_resumption_count.trim() == ''){
      csg.server_resumption_countHelp = 'required';
      csg.server_resumption_countError = true;
    } else if (!(csg.server_resumption_count.match(numRegex) && csg.server_resumption_count.match(numRegex)[0] === csg.server_resumption_count)) {
      csg.server_resumption_countHelp = 'invalid - number only';
      csg.server_resumption_countError = true;
    } else if (csg.server_resumption_count != savedCsg.server_resumption_count) {
      csg.server_resumption_countUnsaved = true;
      csg.server_resumption_countHelp = "modified"
    }
    
    checkFields();

    Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
  } 

  function validateClientCloseNotify (csg_index) {
    const csg = Profile.cs_groups[csg_index];
    const savedCsg = SavedProfile.cs_groups[csg_index];
    
    csg.client_tls_close_typeError = false;
    csg.client_tls_close_typeUnsaved = false;
    csg.client_tls_close_typeHelp = ''

    if (csg.client_tls_close_type.trim() == ''){
      csg.client_tls_close_typeHelp = 'required - SEND | SNDRCV | NONE';
      csg.client_tls_close_typeError = true;
    } else if (!(csg.client_tls_close_type == 'SEND'
                || csg.client_tls_close_type == 'SNDRCV'
                || csg.client_tls_close_type == 'NONE')) {
      csg.client_tls_close_typeHelp = 'options - SEND | SNDRCV | NONE';
      csg.client_tls_close_typeError = true;
    } else if (csg.client_tls_close_type != savedCsg.client_tls_close_type) {
      csg.client_tls_close_typeUnsaved = true;
      csg.client_tls_close_typeHelp = "modified";
    }

    checkFields();

    Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
  }

  function validateServerCloseNotify (csg_index) {
    const csg = Profile.cs_groups[csg_index];
    const savedCsg = SavedProfile.cs_groups[csg_index];
    
    csg.server_tls_close_typeError = false;
    csg.server_tls_close_typeUnsaved = false;
    csg.server_tls_close_typeHelp = ''

    if (csg.server_tls_close_type.trim() == ''){
      csg.server_tls_close_typeHelp = 'required - SEND | SNDRCV | NONE';
      csg.server_tls_close_typeError = true;
    } else if (!(csg.server_tls_close_type == 'SEND'
                || csg.server_tls_close_type == 'SNDRCV'
                || csg.server_tls_close_type == 'NONE')) {
      csg.server_tls_close_typeHelp = 'options - SEND | SNDRCV | NONE';
      csg.server_tls_close_typeError = true;
    } else if (csg.server_tls_close_type != savedCsg.server_tls_close_type) {
      csg.server_tls_close_typeUnsaved = true;
      csg.server_tls_close_typeHelp = "modified";
    }

    checkFields();

    Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
  }

  function validateServerCert (csg_index) {
    const csg = Profile.cs_groups[csg_index];
    const savedCsg = SavedProfile.cs_groups[csg_index];
    
    csg.server_certError = false;
    csg.server_certUnsaved = false;
    csg.server_certHelp = ''

    if (csg.server_cert.trim() == ''){
      csg.server_certHelp = 'required';
      csg.server_certError = true;
    } else if (csg.server_cert != savedCsg.server_cert) {
      csg.server_certUnsaved = true;
      csg.server_certHelp = "modified";
    }

    checkFields();

    Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
  }

  function validateServerKey (csg_index) {
    const csg = Profile.cs_groups[csg_index];
    const savedCsg = SavedProfile.cs_groups[csg_index];
    
    csg.server_keyError = false;
    csg.server_keyUnsaved = false;
    csg.server_keyHelp = ''

    if (csg.server_key.trim() == ''){
      csg.server_keyHelp = 'required';
      csg.server_keyError = true;
    } else if (csg.server_key != savedCsg.server_key) {
      csg.server_keyUnsaved = true;
      csg.server_keyHelp = "modified";
    }

    checkFields();

    Profile.cs_groups[csg_index] = Profile.cs_groups[csg_index];
  }

  function checkFields() {

    Profile.markUnsavedFields = Profile.transactionsUnsaved 
                  || Profile.cpsUnsaved;


    Profile.markErrorFields = Profile.transactionsError 
                  || Profile.cpsError;

    let csg_index = 0;
    for (const csg of Profile.cs_groups) {
      if (csg.fieldAttention == 'mark-delete' 
            || csg.fieldAttention == 'new-csg') {
        Profile.markUnsavedFields = true;
        continue;
      }

      csg.fieldAttention = '';
      if (csg.client_ipsError
          || csg.client_ifaceError
          || csg.server_ifaceError
          || csg.client_ipsError
          || csg.server_ipError
          || csg.server_portError
          || csg.server_sslError
          || csg.client_tcp_close_typeError
          || csg.server_tcp_close_typeError
          || csg.client_tcp_snd_buff_lenError
          || csg.server_tcp_snd_buff_lenError
          || csg.client_tcp_rcv_buff_lenError
          || csg.server_tcp_rcv_buff_lenError
          || csg.client_tls_versionError
          || csg.server_tls_versionError
          || csg.client_tls_cipherError
          || csg.server_tls_cipherError
          || csg.client_resumption_typeError
          || csg.client_resumption_countError
          || csg.server_resumption_typeError
          || csg.server_resumption_countError
          || csg.client_tls_close_typeError
          || csg.server_tls_close_typeError
          || csg.max_active_conn_countError
          || csg.cs_data_lenError
          || csg.sc_data_lenError
          || csg.cs_starttls_lenError
          || csg.sc_starttls_lenError
          || csg.client_read_chunk_lenError
          || csg.server_read_chunk_lenError
          || csg.client_write_chunk_lenError
          || csg.server_write_chunk_lenError
          || csg.server_certError
          || csg.server_keyError
          ) 
      {
        Profile.markErrorFields = true;
        csg.fieldAttention = 'field-update';
      }

      if (csg.client_ipsUnsaved
          || csg.client_ifaceUnsaved
          || csg.server_ifaceUnsaved
          || csg.client_ipsUnsaved
          || csg.server_ipUnsaved
          || csg.server_portUnsaved
          || csg.server_sslUnsaved
          || csg.client_tcp_close_typeUnsaved
          || csg.server_tcp_close_typeUnsaved
          || csg.client_tcp_snd_buff_lenUnsaved
          || csg.server_tcp_snd_buff_lenUnsaved
          || csg.client_tcp_rcv_buff_lenUnsaved
          || csg.server_tcp_rcv_buff_lenUnsaved
          || csg.client_tls_versionUnsaved
          || csg.server_tls_versionUnsaved
          || csg.client_tls_cipherUnsaved
          || csg.server_tls_cipherUnsaved
          || csg.client_resumption_typeUnsaved
          || csg.client_resumption_countUnsaved
          || csg.server_resumption_typeUnsaved
          || csg.server_resumption_countUnsaved
          || csg.client_tls_close_typeUnsaved
          || csg.server_tls_close_typeUnsaved
          || csg.max_active_conn_countUnsaved
          || csg.cs_data_lenUnsaved
          || csg.sc_data_lenUnsaved
          || csg.cs_starttls_lenUnsaved
          || csg.sc_starttls_lenUnsaved
          || csg.client_read_chunk_lenUnsaved
          || csg.server_read_chunk_lenUnsaved
          || csg.client_write_chunk_lenUnsaved
          || csg.server_write_chunk_lenUnsaved
          || csg.server_certUnsaved
          || csg.server_keyUnsaved
          )
      {
        Profile.markUnsavedFields = true;
        csg.fieldAttention = 'field-update';
      }
    }

    checkLastCSG ();
  }

  function validateAllFields() {
    validateTransactions ();
    validateCps ();

    for (let i=0; i < Profile.cs_groups.length; i++) {
      validateClientIface (i);
      validateServerIface (i);
      
      validateClientIPs (i);
      validateServerIP (i);
      validateServerPort (i);
      validateProtocol (i);

      validateClientTcpClose(i);
      validateServerTcpClose (i);
      validateClientSndBuffer (i);
      validateServerSndBuffer (i);
      validateClientRcvBuffer (i);
      validateServerRcvBuffer (i);

      validateClientTlsVersion(i);
      validateServerTlsVersion (i);
      validateClientCipher (i);
      validateServerCipher (i);
      validateClientResType (i);
      validateClientResCount (i);
      validateServerResType (i);
      validateServerResCount (i);
      validateClientCloseNotify (i);
      validateServerCloseNotify (i);

      validateMaxActiveConn (i);
      validateClientDataLen (i);
      validateServerDataLen (i);
      validateClientStartTlsLen (i);
      validateServerStartTlsLen (i);
      validateClientReadChunk (i);
      validateServerReadChunk (i);
      validateClientWriteChunk (i);
      validateServerWriteChunk (i);

      validateServerCert (i);
      validateServerKey (i);
    }
  }

  async function onSave () {
    Profile.isTransient = true;

    const action = 'onSave'; 
    const p = profileNormalize (Profile);

    const controller = new AbortController();
    const signal = controller.signal;

    try {
      Profile.errorMsg = '';
      Profile.isError = false;
      Profile.isProgress = true;
      const res = await fetch ('/api/profiles.json', {
        signal,
        method: 'PUT',
        body: JSON.stringify(p)
      });

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

            const routeViewKey = getProfileStateKey ($page.stuff.Profile.Group, $page.stuff.Profile.Name);
            delete $routeViewState[routeViewKey];

            const connStats = Profile.connStats;
            const connStatsSaved = SavedProfile.connStats;

            const latencyStats = Profile.latencyStats;
            const errStatsSaved = SavedProfile.latencyStats;

            Profile = profileCanonical(p);
            SavedProfile = profileCanonical(p);

            Profile.connStats = connStats;
            SavedProfile.connStats = connStatsSaved;

            Profile.latencyStats = latencyStats;
            SavedProfile.latencyStats = errStatsSaved;

            $routeViewState[routeViewKey] = {Profile, SavedProfile};
            validateAllFields ();
          } else {
            console.log(json);
            setErrorMsg (action, json.message);
          }
        } else {
          setErrorMsg (action, text); 
        }
        Profile.isProgress = false;
      } else {
        console.log(res);
        setErrorMsg (action, res.statusText);
        Profile.isProgress = false;
      }
    } catch (e) {
      setErrorMsg (action, e.toString());
      Profile.isProgress = false;
    }
    Profile.isTransient = false;
  }

  async function onStop () {
    Profile.isTransient = true;
    let action = 'onStop';

    restartWS ();

    const controller = new AbortController();
    const signal = controller.signal;

    try {
      Profile.errorMsg = '';
      Profile.isError = false;
      Profile.isProgress = true;
      Profile.progressText = 'Stop ...';
      const res = await fetch ('/api/profile_runs.json', {
        signal,
        method: 'DELETE',
        body: JSON.stringify({'Group': Profile.Group,
                                'Name': Profile.Name})
      });

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
          } else {
            console.log(json);
            setErrorMsg (action, json.message);
            Profile.isProgress = false;
          }
        } else {
          setErrorMsg (action, text);
          Profile.isProgress = false;
        }
      } else {
        console.log(res);
        setErrorMsg (action, res.statusText);
        Profile.isProgress = false;
      }
    } catch (e) {
      setErrorMsg (action, e.toString());
      Profile.isProgress = false;
    }

    Profile.isTransient = false;
  }
  
  function getConnStats () {
    return JSON.parse (JSON.stringify ([
      {id: 1,
        Name: 'TcpInit',
        Client: 0,
        Server: 0},

        {id: 2,
        Name: 'TcpConn',
        Client: 0,
        Server: 0},

        {id: 3,
        Name: 'SslInit',
        Client: 0,
        Server: 0},

        {id: 4,
        Name: 'SslConn',
        Client: 0,
        Server: 0},

        {id: 5,
        Name: 'ActConn',
        Client: 0,
        Server: 0},

        {id: 6,
        Name: 'ConnErr',
        Client: 0,
        Server: 0}
      ]));
  }

  function getLatencyStats () {
    return JSON.parse (JSON.stringify ([
      {id: 1,
        Name: 'TcpAvgLat',
        Client: 0,
        Server: 0},

        {id: 2,
        Name: 'TlsAvgLat',
        Client: 0,
        Server: 0},

        {id: 3,
        Name: 'AppAvgLat',
        Client: 0,
        Server: 0},

        {id: 4,
        Name: 'BytesSent',
        Client: 0,
        Server: 0},

        {id: 5,
        Name: 'BytesRcvd',
        Client: 0,
        Server: 0},

        {id: 6,
        Name: 'SessErr',
        Client: 0,
        Server: 0}
      ]));
  }

  async function clearStats () {
    Profile.connStats = getConnStats();
    SavedProfile.connStats = getConnStats();

    Profile.latencyStats = getLatencyStats();
    SavedProfile.latencyStats = getLatencyStats();
  }

  async function onStart () {
    Profile.isTransient = true;
    clearStats ();

    restartWS ();

    const action = 'onStart';
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      Profile.errorMsg = '';
      Profile.isError = false;
      Profile.isProgress = true;
      Profile.progressText = 'Start ...';
      const res = await fetch ('/api/profile_runs.json', {
        signal,
        method: 'POST',
        body: JSON.stringify({'Group': Profile.Group,
                                'Name': Profile.Name})
      });

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
            Profile.isRunning = true;
          } else {
            console.log(json);
            setErrorMsg (action, json.message);
            Profile.isProgress = false;
          }
        } else {
          setErrorMsg (action, text);
          Profile.isProgress = false;
        }
      } else {
        console.log(res);
        setErrorMsg (action, res.statusText);
        Profile.isProgress = false;
      }
    } catch (e) {
      setErrorMsg (action, e.toString());
      Profile.isProgress = false;
    }
    Profile.isTransient = false;
  }


  async function onStartCapture () {
    Profile.isTransient = true;
    clearStats ();

    const action = 'onStartCapture';
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      Profile.errorMsg = '';
      Profile.isError = false;
      Profile.isProgress = true;
      Profile.progressText = 'Capture On...';
      const res = await fetch ('/api/profile_tcpdump.pcap', {
        signal,
        method: 'POST',
        body: JSON.stringify({'Group': Profile.Group,
                                'Name': Profile.Name})
      });

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
            Profile.isCapturing = 1;
            Profile.isProgress = false;
          } else {
            console.log(json);
            setErrorMsg (action, json.message);
            Profile.isProgress = false;
          }
        } else {
          setErrorMsg (action, text);
          Profile.isProgress = false;
        }
      } else {
        console.log(res);
        setErrorMsg (action, res.statusText);
        Profile.isProgress = false;
      }
    } catch (e) {
      setErrorMsg (action, e.toString());
      Profile.isProgress = false;
    }
    Profile.isTransient = false;
  }

  async function onStopCapture () {
    Profile.isTransient = true;
    clearStats ();

    const action = 'onStopCapture';
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      Profile.errorMsg = '';
      Profile.isError = false;
      Profile.isProgress = true;
      Profile.progressText = 'Capture Off...';
      const res = await fetch ('/api/profile_tcpdump.pcap', {
        signal,
        method: 'DELETE',
        body: JSON.stringify({'Group': Profile.Group,
                                'Name': Profile.Name})
      });

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
            Profile.isCapturing = 0;
            Profile.isProgress = false;
          } else {
            console.log(json);
            setErrorMsg (action, json.message);
            Profile.isProgress = false;
          }
        } else {
          setErrorMsg (action, text);
          Profile.isProgress = false;
        }
      } else {
        console.log(res);
        setErrorMsg (action, res.statusText);
        Profile.isProgress = false;
      }
    } catch (e) {
      setErrorMsg (action, e.toString());
      Profile.isProgress = false;
    }
    Profile.isTransient = false;
  }

  async function onAddTrafficPath () {

    Profile.isTransient = true;

    let action = 'onAddTrafficPath';

    const controller = new AbortController();
    const signal = controller.signal;

    try {
      const group = Profile.Group;
      const name = Profile.Name;
      const newcsg = Profile.cs_groups.length;
      Profile.errorMsg = '';
      Profile.isError = false;
      Profile.isProgress = true;
      Profile.progressText = 'Add Path ...';
      const res = await fetch (`/api/profiles.json?group=${group}&name=${name}&newcsg=${newcsg}`);
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
            const csg = json.data;
            csgCanonical (csg);
            const csg2 = JSON.parse(JSON.stringify(csg));

            csg.fieldAttention = 'new-csg';

            Profile.cs_groups.push (csg);
            Profile.cs_groups = [...Profile.cs_groups];

            SavedProfile.cs_groups.push (csg2);
            SavedProfile.cs_groups = [...SavedProfile.cs_groups];

            Profile.markUnsavedFields = true;
          } else {
            console.log(json);
            setErrorMsg (action, json.message);
            Profile.isProgress = false;
          }
        } else {
          setErrorMsg (action, text);
          Profile.isProgress = false;
        }
      } else {
        console.log(res);
        setErrorMsg (action, res.statusText);
        Profile.isProgress = false;
      }
    } catch (e) {
      setErrorMsg (action, e.toString());
      Profile.isProgress = false;
    }

    Profile.isTransient = false;
  }

  function checkLastCSG () {
    Profile.isLastCSG = false;

    let csg_count = 0;
    for (const csg of Profile.cs_groups) {
      if (csg.fieldAttention == 'mark-delete') {
        continue;
      }
      csg_count += 1;
    }

    if ( csg_count == 1) {
      Profile.isLastCSG = true;
    }

    return Profile.isLastCSG
  }

  function onMarkUnmarkDelete (row_index) {
    if (Profile.cs_groups[row_index].fieldAttention == 'mark-delete') {
        Profile.cs_groups[row_index].fieldAttention = '';
        checkFields();
      } else if (!checkLastCSG()) {
        Profile.cs_groups[row_index].fieldAttention = 'mark-delete';
        Profile.markUnsavedFields = true;
      }
  }

  function setPropsChecked (is_checked) {

    clientInterfaceChecked = is_checked;
    serverInterfaceChecked = is_checked;

    serverPortChecked = is_checked;
    protocolChecked = is_checked;

    clientCloseChecked = is_checked;
    serverCloseChecked = is_checked;
    clientSndBufferChecked = is_checked;
    serverSndBufferChecked = is_checked;
    clientRcvBufferChecked = is_checked;
    serverRcvBufferChecked = is_checked;

    clientVersionChecked = is_checked;
    serverVersionChecked = is_checked;
    clientCiphersChecked = is_checked;
    serverCiphersChecked = is_checked;
    clientResTypeChecked = is_checked;
    serverResTypeChecked = is_checked;
    clientResCountChecked = is_checked;
    serverResCountChecked = is_checked;
    clientCloseNotifyChecked = is_checked;
    serverCloseNotifyChecked = is_checked;

    maxActionChecked = is_checked;
    clientDataLenChecked = is_checked;
    serverDataLenChecked = is_checked;
    clientStartTlsChecked = is_checked;
    serverStartTlsChecked = is_checked;
    clientReadChunkChecked = is_checked;
    serverReadChunkChecked = is_checked;
    clientWriteChunkChecked = is_checked;
    serverWriteChunkChecked = is_checked;

    serverCertKeyChecked = is_checked;
  }


  function onAllPropsChecked () {
    allPropsChecked = !allPropsChecked;

    setPropsChecked (allPropsChecked);
  }

  function onAllCsgChecked () {
    allCsgChecked = !allCsgChecked;

    for (let i=0; i < csgCheckedList.length; i++) {
      csgCheckedList[i].isChecked = allCsgChecked;
    }

    csgCheckedList = [...csgCheckedList];
  }

  function onApplyDefault (row_index) {
    applyIndex = row_index;

    allPropsChecked = false;
    allCsgChecked = false;
    csgCheckedList = [];

    for (let i=0; i < Profile.cs_groups.length; i++) {
      if (i == applyIndex) {
        continue;
      }

      csgCheckedList.push({'Name' : Profile.cs_groups[i].app_id
                            , 'isChecked': false
                            , 'index': i});
    }

    setPropsChecked (false);

    showApplyDefault = true;
  }

  function onClose () {
    showApplyDefault = false;
  }

  function onApply () {
    const defCsg = Profile.cs_groups[applyIndex];

    let i;

    for (const selectedCsg of csgCheckedList) {
      if (!selectedCsg.isChecked) {
        continue;
      }

      i = selectedCsg.index;

      if (clientInterfaceChecked){
        Profile.cs_groups[i].client_iface = defCsg.client_iface;
      }
      
      if (serverInterfaceChecked){
        Profile.cs_groups[i].server_iface = defCsg.server_iface;
      }
      
      if (serverPortChecked){
        Profile.cs_groups[i].server_port = defCsg.server_port;
      }

      if (protocolChecked){
        Profile.cs_groups[i].server_ssl = defCsg.server_ssl;
      }

      if (clientCloseChecked){
        Profile.cs_groups[i].client_tcp_close_type = defCsg.client_tcp_close_type;
      }

      if (serverCloseChecked){
        Profile.cs_groups[i].server_tcp_close_type = defCsg.server_tcp_close_type;
      }

      if (clientSndBufferChecked){
        Profile.cs_groups[i].client_tcp_snd_buff_len = defCsg.client_tcp_snd_buff_len;
      }

      if (serverSndBufferChecked){
        Profile.cs_groups[i].server_tcp_snd_buff_len = defCsg.server_tcp_snd_buff_len;
      }

      if (clientRcvBufferChecked){
        Profile.cs_groups[i].client_tcp_rcv_buff_len = defCsg.client_tcp_rcv_buff_len;
      }

      if (serverRcvBufferChecked){
        Profile.cs_groups[i].server_tcp_rcv_buff_len = defCsg.server_tcp_rcv_buff_len;
      }

      if (clientVersionChecked){
        Profile.cs_groups[i].client_tls_version = defCsg.client_tls_version;
      }

      if (serverVersionChecked){
        Profile.cs_groups[i].server_tls_version = defCsg.server_tls_version;
      }

      if (clientCiphersChecked){
        Profile.cs_groups[i].client_tls_cipher = defCsg.client_tls_cipher;
      }

      if (serverCiphersChecked){
        Profile.cs_groups[i].server_tls_cipher = defCsg.server_tls_cipher;
      }

      if (clientResTypeChecked){
        Profile.cs_groups[i].client_resumption_type = defCsg.client_resumption_type;
      }

      if (clientResCountChecked){
        Profile.cs_groups[i].client_resumption_count = defCsg.client_resumption_count;
      }

      if (serverResTypeChecked){
        Profile.cs_groups[i].server_resumption_type = defCsg.server_resumption_type;
      }

      if (serverResCountChecked){
        Profile.cs_groups[i].server_resumption_count = defCsg.server_resumption_count;
      }

      if (clientCloseNotifyChecked){
        Profile.cs_groups[i].client_tls_close_type = defCsg.client_tls_close_type;
      }

      if (serverCloseNotifyChecked){
        Profile.cs_groups[i].server_tls_close_type = defCsg.server_tls_close_type;
      }

      if (maxActionChecked){
        Profile.cs_groups[i].max_active_conn_count = defCsg.max_active_conn_count;
      }

      if (clientDataLenChecked){
        Profile.cs_groups[i].cs_data_len = defCsg.cs_data_len;
      }

      if (serverDataLenChecked){
        Profile.cs_groups[i].sc_data_len = defCsg.sc_data_len;
      }

      if (clientStartTlsChecked){
        Profile.cs_groups[i].cs_starttls_len = defCsg.cs_starttls_len;
      }

      if (serverStartTlsChecked){
        Profile.cs_groups[i].sc_starttls_len = defCsg.sc_starttls_len;
      }

      if (clientReadChunkChecked){
        Profile.cs_groups[i].client_read_chunk_len = defCsg.client_read_chunk_len;
      }

      if (serverReadChunkChecked){
        Profile.cs_groups[i].server_read_chunk_len = defCsg.server_read_chunk_len;
      }

      if (clientWriteChunkChecked){
        Profile.cs_groups[i].client_write_chunk_len = defCsg.client_write_chunk_len;
      }

      if (serverWriteChunkChecked){
        Profile.cs_groups[i].server_write_chunk_len = defCsg.server_write_chunk_len;
      }

      if (serverCertKeyChecked){
        Profile.cs_groups[i].server_cert = defCsg.server_cert;
        Profile.cs_groups[i].server_key = defCsg.server_key;
      }
    }

    Profile.cs_groups = [...Profile.cs_groups];

    validateAllFields ();

    showApplyDefault = false;
  }

  async function onProfileAction () {
    if (Profile.isRunning) {     
      await onStop();
      if (Profile.isCapturing) {
        // await onStopCapture();
      }
    } else {
      if (Profile.markUnsavedFields || Profile.markErrorFields) {
        await onSave();
      } else {
        // await onStartCapture();
        await onStart();
      }
    }
  }

  async function onCaptureAction () {
    if (Profile.isCapturing) {
      // await onStopCapture();
    } else {
      // await onStartCapture();
    }
  }

  let statsWS = null;

  let cpsChartCtx;
  let cpsChartCanvas;
  let cpsChart;

  let clntThptChartCtx;
  let clntThptChartCanvas;
  let clntThptChart;

  let srvrThptChartCtx;
  let srvrThptChartCanvas;
  let srvrThptChart;

  const csGroupHeaders = [
    {key: 'app_id', value: 'Group'},
    {key: 'client_ips', value: 'Client'},
    {key: 'server_ip', value: 'Server'},
    {key: 'server_ssl', value: 'Protocol'},
    {key: 'server_port', value: 'Port'},
    {key: 'fieldAttention', value: ''}
  ];

  const topStatsHeaders = [
    {key: 'Name', value: 'Name'},
    {key: 'Client', value: 'Client'},
    {key: 'Server', value: 'Server'}
  ];

  const latencyStatsHeaders = [
    {key: 'Name', value: 'Name'},
    {key: 'Client', value: 'Client'},
    {key: 'Server', value: 'Server'}
  ];

function csgCanonical (csg) {

  csg.id = csg.app_id;

  csg.client_ifaceError = false;
  csg.client_ifaceUnsaved = false;
  csg.client_ifaceHelp = ''

  csg.server_ifaceError = false;
  csg.server_ifaceUnsaved = false;
  csg.server_ifaceHelp = ''


  csg.client_ips = csg.client_ips.join(',');
  csg.client_ipsError = false;
  csg.client_ipsUnsaved = false;
  csg.client_ipsHelp = ''

  csg.server_ipError = false;
  csg.server_ipUnsaved = false;
  csg.server_ipHelp = '';

  csg.server_port = csg.server_port.toString();
  csg.server_portError = false;
  csg.server_portUnsaved = false;
  csg.server_portHelp = '';

  
  if (csg.server_ssl == 0) {
    csg.server_ssl = 'TCP';
  } else {
    csg.server_ssl = 'SSL';
  }
  csg.server_sslError = false;
  csg.server_sslUnsaved = false;
  csg.server_sslHelp = '';

  csg.client_tls_versionError = false;
  csg.client_tls_versionUnsaved = false;
  csg.client_tls_versionHelp = '';

  csg.server_tls_versionError = false;
  csg.server_tls_versionUnsaved = false;
  csg.server_tls_versionHelp = '';

  csg.client_tls_cipherError = false;
  csg.client_tls_cipherUnsaved = false;
  csg.client_tls_cipherHelp = '';

  csg.server_tls_cipherError = false;
  csg.server_tls_cipherUnsaved = false;
  csg.server_tls_cipherHelp = '';

  if (csg.client_tcp_close_type == 'close_fin') {
    csg.client_tcp_close_type = 'FIN';
  } else {
    csg.client_tcp_close_type = 'RST';
  }

  if (csg.server_tcp_close_type == 'close_fin') {
    csg.server_tcp_close_type = 'FIN';
  } else {
    csg.server_tcp_close_type = 'RST';
  }

  csg.client_tcp_close_typeError = false;
  csg.client_tcp_close_typeUnsaved = false;
  csg.client_tcp_close_typeHelp = '';

  csg.server_tcp_close_typeError = false;
  csg.server_tcp_close_typeUnsaved = false;
  csg.server_tcp_close_typeHelp = '';

  if (csg.client_tls_close_type == 'close_notify_send') {
    csg.client_tls_close_type = 'SEND';
  } else if (csg.client_tls_close_type == 'close_notify_send_recv') {
    csg.client_tls_close_type = 'SNDRCV'
  } else {
    csg.client_tls_close_type = 'NONE'
  } 
  csg.client_tls_close_typeError = false;
  csg.client_tls_close_typeUnsaved = false;
  csg.client_tls_close_typeHelp = '';

  if (csg.server_tls_close_type == 'close_notify_send') {
    csg.server_tls_close_type = 'SEND';
  } else if (csg.server_tls_close_type == 'close_notify_send_recv') {
    csg.server_tls_close_type = 'SNDRCV'
  } else {
    csg.server_tls_close_type = 'NONE'
  }
  csg.server_tls_close_typeError = false;
  csg.server_tls_close_typeUnsaved = false;
  csg.server_tls_close_typeHelp = '';

  csg.client_resumption_count = csg.client_resumption_count.toString();
  csg.client_resumption_countError = false;
  csg.client_resumption_countUnsaved = false;
  csg.client_resumption_countHelp = '';

  csg.server_resumption_count = csg.server_resumption_count.toString();
  csg.server_resumption_countError = false;
  csg.server_resumption_countUnsaved = false;
  csg.server_resumption_countHelp = '';

  if (csg.client_resumption_type == 'session_id') {
    csg.client_resumption_type = 'SESSID';
  } else if (csg.client_resumption_type == 'session_ticket') {
    csg.client_resumption_type = 'TICKET';
  } else if (csg.client_resumption_type == 'session_ticket_and_id') {
    csg.client_resumption_type = 'ALL';
  } else {
    csg.client_resumption_type = 'NONE';
  }
  csg.client_resumption_typeError = false;
  csg.client_resumption_typeUnsaved = false;
  csg.client_resumption_typeHelp = '';

  if (csg.server_resumption_type == 'session_id') {
    csg.server_resumption_type = 'SESSID';
  } else if (csg.server_resumption_type == 'session_ticket') {
    csg.server_resumption_type = 'TICKET';
  } else if (csg.server_resumption_type == 'session_ticket_and_id') {
    csg.server_resumption_type = 'ALL';
  } else {
    csg.server_resumption_type = 'NONE';
  }
  csg.server_resumption_typeError = false;
  csg.server_resumption_typeUnsaved = false;
  csg.server_resumption_typeHelp = '';

  csg.max_active_conn_count = csg.max_active_conn_count.toString();
  csg.max_active_conn_countError = false;
  csg.max_active_conn_countUnsaved = false;
  csg.max_active_conn_countHelp = '';

  csg.cs_data_len = csg.cs_data_len.toString();
  csg.cs_data_lenError = false;
  csg.cs_data_lenUnsaved = false;
  csg.cs_data_lenHelp = '';

  csg.sc_data_len = csg.sc_data_len.toString();
  csg.sc_data_lenError = false;
  csg.sc_data_lenUnsaved = false;
  csg.sc_data_lenHelp = '';

  csg.cs_starttls_len = csg.cs_starttls_len.toString();
  csg.cs_starttls_lenError = false;
  csg.cs_starttls_lenUnsaved = false;
  csg.cs_starttls_lenHelp = '';

  csg.sc_starttls_len = csg.sc_starttls_len.toString();
  csg.sc_starttls_lenError = false;
  csg.sc_starttls_lenUnsaved = false;
  csg.sc_starttls_lenHelp = '';

  csg.client_tcp_rcv_buff_len = csg.client_tcp_rcv_buff_len.toString();
  csg.client_tcp_rcv_buff_lenError = false;
  csg.client_tcp_rcv_buff_lenUnsaved = false;
  csg.client_tcp_rcv_buff_lenHelp = '';

  csg.server_tcp_rcv_buff_len = csg.server_tcp_rcv_buff_len.toString();
  csg.server_tcp_rcv_buff_lenError = false;
  csg.server_tcp_rcv_buff_lenUnsaved = false;
  csg.server_tcp_rcv_buff_lenHelp = '';

  csg.client_tcp_snd_buff_len = csg.client_tcp_snd_buff_len.toString();
  csg.client_tcp_snd_buff_lenError = false;
  csg.client_tcp_snd_buff_lenUnsaved = false;
  csg.client_tcp_snd_buff_lenHelp = '';

  csg.server_tcp_snd_buff_len = csg.server_tcp_snd_buff_len.toString();
  csg.server_tcp_snd_buff_lenError = false;
  csg.server_tcp_snd_buff_lenUnsaved = false;
  csg.server_tcp_snd_buff_lenHelp = '';

  csg.client_read_chunk_len = csg.client_read_chunk_len.toString();
  csg.client_read_chunk_lenError = false;
  csg.client_read_chunk_lenUnsaved = false;
  csg.client_read_chunk_lenHelp = '';

  csg.server_read_chunk_len = csg.server_read_chunk_len.toString();
  csg.server_read_chunk_lenError = false;
  csg.server_read_chunk_lenUnsaved = false;
  csg.server_read_chunk_lenHelp = '';

  csg.client_write_chunk_len = csg.client_write_chunk_len.toString();
  csg.client_write_chunk_lenError = false;
  csg.client_write_chunk_lenUnsaved = false;
  csg.client_write_chunk_lenHelp = '';

  csg.server_write_chunk_len = csg.server_write_chunk_len.toString();
  csg.server_write_chunk_lenError = false;
  csg.server_write_chunk_lenUnsaved = false;
  csg.server_write_chunk_lenHelp = '';

  csg.server_certError = false;
  csg.server_certUnsaved = false;
  csg.server_certHelp = '';

  csg.server_keyError = false;
  csg.server_keyUnsaved = false;
  csg.server_keyHelp = '';
}

function profileCanonical (p) {

  const p2 = JSON.parse(JSON.stringify(p));

  p2.Transactions = p2.Transactions.toString();
  p2.CPS = p2.CPS.toString();
  
  //for table header and row
  for (const csg of p2.cs_groups) {
    csgCanonical (csg);
  }

  return p2;
}

function profileNormalize (p) {
  const p2 = {};

  p2.Group = p.Group;
  p2.Name = p.Name;
  p2.Type = p.Type;


  p2.Transactions = parseInt(p.Transactions);
  p2.CPS = parseInt(p.CPS);

  p2.ClientIface = p.ClientIface;
  p2.ServerIface = p.ServerIface;

  let csg_count = 0;
  for (const csg of p.cs_groups) {
    if (csg.fieldAttention == 'mark-delete') {
      continue;
    }
    csg_count += 1;
  }

  p2.cs_groups = [];
  let csg_index = 0;
  for (const csg of p.cs_groups) {

    if (csg.fieldAttention == 'mark-delete') {
      continue;
    }

    const csg2 = {};

    csg2.index = csg_index;
    csg_index += 1;

    csg2.app_id = "CSG" + csg_index.toString();
    csg2.app_gid = csg.app_gid;

    csg2.client_iface = csg.client_iface;
    csg2.server_iface = csg.server_iface;

    csg2.client_ips = csg.client_ips.split(',');
    csg2.server_ip = csg.server_ip;

    csg2.server_port = parseInt(csg.server_port);

    if (csg.server_ssl == 'TCP') {
      csg2.server_ssl = 0;
    } else {
      csg2.server_ssl = 1;
    }

    csg2.server_key = csg.server_key;
    csg2.server_cert = csg.server_cert;

    csg2.client_tls_version = csg.client_tls_version;
    csg2.server_tls_version = csg.server_tls_version;

    csg2.client_tls_cipher = csg.client_tls_cipher;
    csg2.server_tls_cipher = csg.server_tls_cipher;

    if (csg.client_tcp_close_type == 'FIN') {
      csg2.client_tcp_close_type = 'close_fin';
    } else {
      csg2.client_tcp_close_type = 'close_reset';
    }

    if (csg.server_tcp_close_type == 'FIN') {
      csg2.server_tcp_close_type = 'close_fin';
    } else {
      csg2.server_tcp_close_type = 'close_reset';
    }

    if (csg.client_tls_close_type == 'SEND') {
      csg2.client_tls_close_type = 'close_notify_send';
    } else if (csg.client_tls_close_type == 'SNDRCV') {
      csg2.client_tls_close_type = 'close_notify_send_recv';
    } else {
      csg2.client_tls_close_type = 'close_notify_no_send';
    }

    if (csg.server_tls_close_type == 'SEND') {
      csg2.server_tls_close_type = 'close_notify_send';
    } else if (csg.server_tls_close_type == 'SNDRCV') {
      csg2.server_tls_close_type = 'close_notify_send_recv';
    } else {
      csg2.server_tls_close_type = 'close_notify_no_send';
    }

    if (csg.client_resumption_type == 'SESSID') {
      csg2.client_resumption_type = 'session_id';
    } else if (csg.client_resumption_type == 'TICKET') {
      csg2.client_resumption_type = 'session_ticket';
    } else if (csg.client_resumption_type == 'ALL') {
      csg2.client_resumption_type = 'session_ticket_and_id';
    } else {
      csg2.client_resumption_type = 'session_none';
    }

    if (csg.server_resumption_type == 'SESSID') {
      csg2.server_resumption_type = 'session_id';
    } else if (csg.server_resumption_type == 'TICKET') {
      csg2.server_resumption_type = 'session_ticket';
    } else if (csg.server_resumption_type == 'ALL') {
      csg2.server_resumption_type = 'session_ticket_and_id';
    } else {
      csg2.server_resumption_type = 'session_none';
    }

    csg2.client_resumption_count = parseInt(csg.client_resumption_count);
    csg2.server_resumption_count = parseInt(csg.server_resumption_count);

    csg2.max_active_conn_count = parseInt(csg.max_active_conn_count);

    csg2.client_tcp_rcv_buff_len = parseInt(csg.client_tcp_rcv_buff_len);
    csg2.server_tcp_rcv_buff_len = parseInt(csg.server_tcp_rcv_buff_len);

    csg2.client_tcp_snd_buff_len = parseInt(csg.client_tcp_snd_buff_len);
    csg2.server_tcp_snd_buff_len = parseInt(csg.server_tcp_snd_buff_len);

    csg2.client_read_chunk_len = parseInt(csg.client_read_chunk_len);
    csg2.server_read_chunk_len = parseInt(csg.server_read_chunk_len);

    csg2.client_write_chunk_len = parseInt(csg.client_write_chunk_len);
    csg2.server_write_chunk_len = parseInt(csg.server_write_chunk_len);

    csg2.cs_data_len = parseInt(csg.cs_data_len);
    csg2.sc_data_len = parseInt(csg.sc_data_len);
    csg2.cs_starttls_len = parseInt(csg.cs_starttls_len);
    csg2.sc_starttls_len = parseInt(csg.sc_starttls_len);
    
    csg2.cps = Math.floor (p2.CPS / csg_count); 
    csg2.total_conn_count = Math.floor (p2.Transactions / csg_count);

    p2.cs_groups.push (csg2);
  }

  if (p2.CPS % csg_count) {
    let cpsReminder = p2.CPS % csg_count;
    while (cpsReminder > 0) {
      for (const csg2 of p2.cs_groups) {

        csg2.cps += 1;
        cpsReminder -= 1;

        if (cpsReminder == 0) {
          break;
        }
      }
    }
  }


  if (p2.Transactions % csg_count) {
    let transactionReminder = p2.Transactions % csg_count;
    while (transactionReminder > 0) {
      for (const csg2 of p2.cs_groups) {
        
        csg2.total_conn_count += 1;
        transactionReminder -= 1;

        if (transactionReminder == 0) {
          break;
        }
      }
    }
  }

  return p2;
}

let Profile = null;
let SavedProfile = null;

async function restartWS () {
  
  if (statsWS) {
    statsWS.close();
    statsWS = null;
  }

  const wsPort = parseInt($page.url.port) + 2;
  const wsHost = $page.url.hostname;
  const wsUrl = 'ws://' + wsHost + ':' + wsPort + '/ws';

  statsWS = new WebSocket (wsUrl);

  statsWS.addEventListener ('open', async () => {
    await statsWS.send (JSON.stringify({Group: Profile.Group, Name: Profile.Name}));
  });

  statsWS.addEventListener ('close', () => {
  });

  statsWS.addEventListener ('message', async (event) => {

    try {
      let json = JSON.parse (event.data);

      Profile.Stats = json.stats;
      const task =json.task;
      Profile.isCapturing = json.capon;

      Profile.isRunning = (task.State == 'run');
      Profile.isProgress = (task.Status == 'progress');
      Profile.progressText = task.Events.length ? task.Events[task.Events.length-1] : Profile.progressText;
      
      if (!Profile.isProgress) {
        await tick ();
        if (Profile.Stats.TlsClient.sum.tci >=0 
                  && Profile.Stats.TlsServer.sum.tci >= 0) {
          Profile.connStats[0].Client = Profile.Stats.TlsClient.sum.tci;
          Profile.connStats[1].Client = Profile.Stats.TlsClient.sum.tcis;
          Profile.connStats[2].Client = Profile.Stats.TlsClient.sum.sci;
          Profile.connStats[3].Client = Profile.Stats.TlsClient.sum.scis;
          Profile.connStats[4].Client = Profile.Stats.TlsClient.sum.tac;
          Profile.connStats[5].Client = Profile.Stats.TlsClient.sum.tcif + Profile.Stats.TlsClient.sum.scif;

          Profile.connStats[0].Server = 0;
          Profile.connStats[1].Server = Profile.Stats.TlsServer.sum.tas;
          Profile.connStats[2].Server = 0;
          Profile.connStats[3].Server = Profile.Stats.TlsServer.sum.sas;
          Profile.connStats[4].Server = Profile.Stats.TlsServer.sum.tac;
          Profile.connStats[5].Server = 0;

          Profile.latencyStats[0].Client = Profile.Stats.TlsClient.sum.tcal;
          Profile.latencyStats[1].Client = Profile.Stats.TlsClient.sum.scal;
          Profile.latencyStats[2].Client = Profile.Stats.TlsClient.sum.adal;
          Profile.latencyStats[3].Client = Profile.Stats.TlsClient.sum.adbs;
          Profile.latencyStats[4].Client = Profile.Stats.TlsClient.sum.adbr;
          Profile.latencyStats[5].Client = Profile.Stats.TlsClient.sum.asprt;

          Profile.latencyStats[0].Server = 0;
          Profile.latencyStats[1].Server = 0;
          Profile.latencyStats[2].Server = 0;
          Profile.latencyStats[3].Server = Profile.Stats.TlsServer.sum.adbs;
          Profile.latencyStats[4].Server = Profile.Stats.TlsServer.sum.adbr;
          Profile.latencyStats[5].Server = Profile.Stats.TlsServer.sum.asprt;


          cpsChartDataSet[0].data = Profile.Stats.tickStats.TlsClient.map(v => v.sum.tcir);
          cpsChartDataSet[1].data = Profile.Stats.tickStats.TlsClient.map(v => v.sum.tcisr);
          cpsChartDataSet[2].data = Profile.Stats.tickStats.TlsClient.map(v => v.sum.scir);
          cpsChartDataSet[3].data = Profile.Stats.tickStats.TlsClient.map(v => v.scisr);

          clntThptChartDataSet[0].data = Profile.Stats.tickStats.TlsClient.map(v => v.sum.dt);
          clntThptChartDataSet[1].data = Profile.Stats.tickStats.TlsClient.map(v => v.sum.dst);
          clntThptChartDataSet[2].data = Profile.Stats.tickStats.TlsClient.map(v => v.sum.drt);

          srvrThptChartDataSet[0].data = Profile.Stats.tickStats.TlsClient.map(v => v.sum.adal);

          cpsChart.update();
          clntThptChart.update();
          srvrThptChart.update();
        }
      }
    } catch (e) {

    }

    isLoading = false;
    await statsWS.send (JSON.stringify({Group: Profile.Group, Name: Profile.Name}));

  });    
}


beforeUpdate ( async () => {

  const routeViewKey = getProfileStateKey ($page.stuff.Profile.Group, $page.stuff.Profile.Name);

  if (Profile 
          && Profile.Group == $page.stuff.Profile.Group
          && Profile.Name == $page.stuff.Profile.Name) {

    //skip updating Profile; as this is case of field update
  } else {
    isLoading = true;

    if ($routeViewState[routeViewKey]) {
      Profile = $routeViewState[routeViewKey].Profile;
      SavedProfile = $routeViewState[routeViewKey].SavedProfile;

      clearStats ();
      validateAllFields ();
      checkLastCSG ();
    } else {

      Profile = profileCanonical ($page.stuff.Profile);
      SavedProfile = profileCanonical ($page.stuff.Profile);

      $routeViewState[routeViewKey] = {Profile, SavedProfile};

      clearStats ();
      validateAllFields ();
      checkLastCSG ();
    }

    restartWS();
  }
});

let cpsChartDataSet = [{
  fill: false,
  borderWidth: 1.5,
  lineTension: 0.1,
  borderColor: 'rgb(255, 116, 65)',
  data: []
},
{
  fill: false,
  borderWidth: 1.5,
  lineTension: 0.1,
  borderColor: 'rgb(255, 116, 65)',
  data: []
},
{
  fill: false,
  borderWidth: 1.5,
  lineTension: 0.1,
  borderColor: 'rgb(255, 116, 65)',
  data: []
},
{
  fill: false,
  borderWidth: 1.5,
  lineTension: 0.1,
  borderColor: 'rgb(255, 116, 65)',
  data: []
}];


let clntThptChartDataSet = [{
  fill: true,
  borderWidth: 1.5,
  lineTension: 0.1,
  borderColor: 'rgb(255, 116, 65)',
  data: []
},
{
  fill: false,
  borderWidth: 1.5,
  lineTension: 0.1,
  borderColor: 'rgb(255, 116, 65)',
  data: []
},
{
  fill: false,
  borderWidth: 1.5,
  lineTension: 0.1,
  borderColor: 'rgb(255, 116, 65)',
  data: []
}];

let srvrThptChartDataSet = [{
  fill: true,
  borderWidth: 1.5,
  lineTension: 0.1,
  borderColor: 'rgb(255, 116, 65)',
  data: []
}];


let clntThptChartLables = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];


onMount ( () => {

  // cpsChartCtx = cpsChartCanvas.getContext('2d');
  // cpsChart = new Chart(cpsChartCtx, {
  //     type: 'bar',
  //     data: {
  //       labels: ['tcpInit', 'tcpSucc', 'sslInit', 'sslSucc'],
  //       datasets: cpsChartDataSet
  //     },
  //     options: {
  //       scales: {
  //         y: {
  //           beginAtZero: true
  //         }
  //       },
  //       plugins: {
  //         legend: false
  //       }
  //     }
  // });

  cpsChartCtx = cpsChartCanvas.getContext('2d');
  cpsChart = new Chart(cpsChartCtx, {
      type: 'line',
      data: {
        labels: clntThptChartLables,
        datasets: cpsChartDataSet
      },
      options: {
        elements: {
          point: {
            radius: 0
          }
        },
        animation :{
          duration: 0
        },
        interaction: {
          intersect: false
        },
        plugins: {
          legend: false,
          title: {
            display: true,
            text: 'CPS'
          }
        },
        scales: {
          x: {
            type: 'linear'
          },
          y: {
            beginAtZero: true
          }
        }
      }
  });

  clntThptChartCtx = clntThptChartCanvas.getContext('2d');
  clntThptChart = new Chart(clntThptChartCtx, {
      type: 'line',
      data: {
        labels: clntThptChartLables,
        datasets: clntThptChartDataSet
      },
      options: {
        elements: {
          point: {
            radius: 0
          }
        },
        animation :{
          duration: 0
        },
        interaction: {
          intersect: false
        },
        plugins: {
          legend: false,
          title: {
            display: true,
            text: 'Throughput'
          }
        },
        scales: {
          x: {
            type: 'linear'
          },
          y: {
            beginAtZero: true
          }
        }
      }
  });

  srvrThptChartCtx = srvrThptChartCanvas.getContext('2d');
  srvrThptChart = new Chart(srvrThptChartCtx, {
    type: 'line',
      data: {
        labels: clntThptChartLables,
        datasets: srvrThptChartDataSet
      },
      options: {
        elements: {
          point: {
            radius: 0
          }
        },
        animation :{
          duration: 0
        },
        interaction: {
          intersect: false
        },
        plugins: {
          legend: false,
          title: {
            display: true,
            text: 'Latency'
          }
        },
        scales: {
          x: {
            type: 'linear'
          },
          y: {
            beginAtZero: true
          }
        }
      }
  });
});

onDestroy ( () => {
  if (statsWS) {
    statsWS.close();
    statsWS = null;
  }
});

</script>

{#if isLoading}
<Loading withOverlay={true} small/>  
{/if}


<nav class="breadcrumb is-left breadcrumb-margin" aria-label="breadcrumbs">
<ul>
    <!-- svelte-ignore a11y-missing-attribute -->
    <li class="is-active" ><a>Profile</a></li>

    <!-- svelte-ignore a11y-missing-attribute -->
    <li class="is-active" ><a>{Profile.Group}</a></li>

    <!-- svelte-ignore a11y-missing-attribute -->
    <li class="is-active" ><a>{Profile.Type} : {Profile.Name}</a></li>

    <!-- svelte-ignore a11y-missing-attribute -->
    <li class="is-active"><a> <strong class="{Profile.markUnsavedFields || Profile.markErrorFields ? 'errmsg' : ''}">&nbsp;&nbsp;{Profile.markUnsavedFields ? "Unsaved Fields" : ""} &nbsp;&nbsp;{Profile.markErrorFields ? "Error Fields" : ""}</strong> </a></li>
</ul>
</nav>

<div class="columns is-multiline is-mobile profile-margin">

  <div class="column is-12">
    <div class="tile is-ancestor is-mobile">

      <div class="tile is-4 is-parent">
        <div class="tile is-child my-border">
          <section>
            <div class="columns is-multiline is-mobile start_stop_border">
              
              
              <div class="column is-full">
                <TextInput inline size="sm" bind:value={Profile.Transactions} 
                labelText="Sessions"
                invalidText= "{Profile.transactionsHelp}"
                invalid={(Profile.transactionsError || Profile.transactionsUnsaved)}
                readonly={Profile.isTransient || Profile.isRunning}
                on:keyup={validateTransactions} />
              </div>

              <div class="column is-full">
                  <TextInput inline size="sm" bind:value={Profile.CPS} 
                  labelText="CPS"
                    invalid={(Profile.cpsError || Profile.cpsUnsaved)}
                    invalidText="{Profile.cpsHelp}"
                    readonly={Profile.isTransient || Profile.isRunning}
                    on:keyup={validateCps}/>
              </div>          
              
              <div class="column is-full">
                <div class="field has-text-centered">
                  <div class="control has-text-centered" >
                    <button class="button {Profile.isRunning ? 'is-danger is-light' : 'is-dark'}" 
                      disabled={Profile.isTransient || (!Profile.isRunning && Profile.markErrorFields)}
                      on:click={onProfileAction} > 
                        {#if Profile.isRunning}
                          Stop Traffic
                        {:else}
                          {#if Profile.markUnsavedFields || Profile.markErrorFields}
                            Save Profile
                          {:else}
                            Start Traffic
                          {/if} 
                        {/if}
                    </button>
  
                    <!-- <button class="button is-light is-dark" 
                      disabled={Profile.isTransient || (!Profile.isRunning)}
                      on:click={onCaptureAction} > 
                        {#if Profile.isCapturing}
                          Stop Capture
                        {:else}
                          Start Capture
                        {/if}
                    </button> -->
                  </div>
                </div>
              </div>


            </div>
          </section> 

        </div>
      </div>

      <div class="tile is-4 is-parent">
        <div class="tile is-child my-border">
          <DataTable
          size="compact"
          headers={topStatsHeaders}
          rows={Profile.connStats}
          zebra
          />
        </div>
      </div>

      <div class="tile is-4 is-parent">
        <div class="tile is-child my-border">
          <DataTable
          size="compact"
          headers={latencyStatsHeaders}
          rows={Profile.latencyStats}
          zebra
          />
        </div>
      </div>

    </div>
  </div>

      
  <div class="column is-12">
    {#if Profile.isProgress}
      <div class="field">
        <div class="control" >
          <ProgressBar helperText="{Profile.progressText}"/>
        </div>
      </div>
    {/if}

    {#if Profile.isError}
      <div class="field">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="label">Status</label>
        <div class="control">
          <textarea class="textarea errmsg" placeholder="" rows="{Profile.errorRows}" value={Profile.errorMsg} readonly/>
        </div>
      </div>          
    {/if}
  </div>  


  <div class="column is-12">
    <div class="tile is-ancestor is-mobile">
      <div class="tile is-4 is-parent">
        <div class="tile is-child my-border">
          <canvas bind:this={cpsChartCanvas} id="cpsChart"></canvas>
        </div>
      </div>
      <div class="tile is-4 is-parent">
        <div class="tile is-child my-border">
          <canvas bind:this={clntThptChartCanvas} id="clntThptChart"></canvas>
        </div>
      </div>
      <div class="tile is-4 is-parent">
        <div class="tile is-child my-border">
          <canvas bind:this={srvrThptChartCanvas} id="srvrThptChart"></canvas>
        </div>
      </div>
    </div>
  </div>

  <div class="column is-12">
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label class="label ">Traffic Paths:</label>
    <DataTable
      expandable
      headers={csGroupHeaders}
      rows={Profile.cs_groups}
      size="medium"
      >
      <div slot="expanded-row" let:row>
        <div class="columns is-multiline is-mobile">
          <div class="column">
          </div>

          <div class="column is-three-fifths">
            <br>
            <FormGroup legendText="Interface">
              <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].client_iface} 
              labelText="Client"
              invalidText= "{Profile.cs_groups[row.index].client_ifaceHelp}"
              invalid={(Profile.cs_groups[row.index].client_ifaceError || Profile.cs_groups[row.index].client_ifaceUnsaved)}
              readonly={Profile.isTransient || Profile.isRunning}
              on:keyup={() => validateClientIface (row.index)} />

              <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].server_iface} 
              labelText="Server"
              invalidText= "{Profile.cs_groups[row.index].server_ifaceHelp}"
              invalid={(Profile.cs_groups[row.index].server_ifaceError || Profile.cs_groups[row.index].server_ifaceUnsaved)}
              readonly={Profile.isTransient || Profile.isRunning}
              on:keyup={() => validateServerIface (row.index)} />                  
            </FormGroup>

            <FormGroup legendText="Transport">
              <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].client_ips} 
              labelText="Client IPs"
              invalidText= "{Profile.cs_groups[row.index].client_ipsHelp}"
              invalid={(Profile.cs_groups[row.index].client_ipsError || Profile.cs_groups[row.index].client_ipsUnsaved)}
              readonly={Profile.isTransient || Profile.isRunning}
              on:keyup={() => validateClientIPs (row.index)} />

              <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].server_ip} 
              labelText="Server IP"
              invalidText= "{Profile.cs_groups[row.index].server_ipHelp}"
              invalid={(Profile.cs_groups[row.index].server_ipError || Profile.cs_groups[row.index].server_ipUnsaved)}
              readonly={Profile.isTransient || Profile.isRunning}
              on:keyup={() => validateServerIP (row.index)} />   

              <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].server_port} 
              labelText="Server Port"
              invalidText= "{Profile.cs_groups[row.index].server_portHelp}"
              invalid={(Profile.cs_groups[row.index].server_portError || Profile.cs_groups[row.index].server_portUnsaved)}
              readonly={Profile.isTransient || Profile.isRunning}
              on:keyup={() => validateServerPort (row.index)} />

              <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].server_ssl} 
              labelText="Protocol"
              invalidText= "{Profile.cs_groups[row.index].server_sslHelp}"
              invalid={(Profile.cs_groups[row.index].server_sslError || Profile.cs_groups[row.index].server_sslUnsaved)}
              readonly={Profile.isTransient || Profile.isRunning}
              on:keyup={() => validateProtocol (row.index)} />   

            </FormGroup>

            <FormGroup legendText="TCP">
              <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].client_tcp_close_type} 
              labelText="Client Close"
              invalidText= "{Profile.cs_groups[row.index].client_tcp_close_typeHelp}"
              invalid={(Profile.cs_groups[row.index].client_tcp_close_typeError || Profile.cs_groups[row.index].client_tcp_close_typeUnsaved)}
              readonly={Profile.isTransient || Profile.isRunning}
              on:keyup={() => validateClientTcpClose (row.index)} />

              <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].server_tcp_close_type} 
              labelText="Server Close"
              invalidText= "{Profile.cs_groups[row.index].server_tcp_close_typeHelp}"
              invalid={(Profile.cs_groups[row.index].server_tcp_close_typeError || Profile.cs_groups[row.index].server_tcp_close_typeUnsaved)}
              readonly={Profile.isTransient || Profile.isRunning}
              on:keyup={() => validateServerTcpClose (row.index)} />

              <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].client_tcp_snd_buff_len} 
              labelText="Client SndBuffer"
              invalidText= "{Profile.cs_groups[row.index].client_tcp_snd_buff_lenHelp}"
              invalid={(Profile.cs_groups[row.index].client_tcp_snd_buff_lenError || Profile.cs_groups[row.index].client_tcp_snd_buff_lenUnsaved)}
              readonly={Profile.isTransient || Profile.isRunning}
              on:keyup={() => validateClientSndBuffer (row.index)} />

              <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].server_tcp_snd_buff_len} 
              labelText="Server SndBuffer"
              invalidText= "{Profile.cs_groups[row.index].server_tcp_snd_buff_lenHelp}"
              invalid={(Profile.cs_groups[row.index].server_tcp_snd_buff_lenError || Profile.cs_groups[row.index].server_tcp_snd_buff_lenUnsaved)}
              readonly={Profile.isTransient || Profile.isRunning}
              on:keyup={() => validateServerSndBuffer (row.index)} />

              <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].client_tcp_rcv_buff_len} 
              labelText="Client RcvBuffer"
              invalidText= "{Profile.cs_groups[row.index].client_tcp_rcv_buff_lenHelp}"
              invalid={(Profile.cs_groups[row.index].client_tcp_rcv_buff_lenError || Profile.cs_groups[row.index].client_tcp_rcv_buff_lenUnsaved)}
              readonly={Profile.isTransient || Profile.isRunning}
              on:keyup={() => validateClientRcvBuffer (row.index)} />

              <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].server_tcp_rcv_buff_len} 
              labelText="Server RcvBuffer"
              invalidText= "{Profile.cs_groups[row.index].server_tcp_rcv_buff_lenHelp}"
              invalid={(Profile.cs_groups[row.index].server_tcp_rcv_buff_lenError || Profile.cs_groups[row.index].server_tcp_rcv_buff_lenUnsaved)}
              readonly={Profile.isTransient || Profile.isRunning}
              on:keyup={() => validateServerRcvBuffer (row.index)} />

            </FormGroup>

            <FormGroup legendText="TLS">
              <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].client_tls_version} 
              labelText="Client Version"
              invalidText= "{Profile.cs_groups[row.index].client_tls_versionHelp}"
              invalid={(Profile.cs_groups[row.index].client_tls_versionError || Profile.cs_groups[row.index].client_tls_versionUnsaved)}
              readonly={Profile.isTransient || Profile.isRunning}
              on:keyup={() => validateClientTlsVersion (row.index)} />

              <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].server_tls_version} 
              labelText="Server Version"
              invalidText= "{Profile.cs_groups[row.index].server_tls_versionHelp}"
              invalid={(Profile.cs_groups[row.index].server_tls_versionError || Profile.cs_groups[row.index].server_tls_versionUnsaved)}
              readonly={Profile.isTransient || Profile.isRunning}
              on:keyup={() => validateServerTlsVersion (row.index)} />

              <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].client_tls_cipher} 
              labelText="Client Ciphers"
              invalidText= "{Profile.cs_groups[row.index].client_tls_cipherHelp}"
              invalid={(Profile.cs_groups[row.index].client_tls_cipherError || Profile.cs_groups[row.index].client_tls_cipherUnsaved)}
              readonly={Profile.isTransient || Profile.isRunning}
              on:keyup={() => validateClientCipher (row.index)} />

              <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].server_tls_cipher} 
              labelText="Server Ciphers"
              invalidText= "{Profile.cs_groups[row.index].server_tls_cipherHelp}"
              invalid={(Profile.cs_groups[row.index].server_tls_cipherError || Profile.cs_groups[row.index].server_tls_cipherUnsaved)}
              readonly={Profile.isTransient || Profile.isRunning}
              on:keyup={() => validateServerCipher (row.index)} />

              <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].client_resumption_type} 
              labelText="Client ResType"
              invalidText= "{Profile.cs_groups[row.index].client_resumption_typeHelp}"
              invalid={(Profile.cs_groups[row.index].client_resumption_typeError || Profile.cs_groups[row.index].client_resumption_typeUnsaved)}
              readonly={Profile.isTransient || Profile.isRunning}
              on:keyup={() => validateClientResType (row.index)} />

              <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].client_resumption_count} 
              labelText="Client ResCount"
              invalidText= "{Profile.cs_groups[row.index].client_resumption_countHelp}"
              invalid={(Profile.cs_groups[row.index].client_resumption_countError || Profile.cs_groups[row.index].client_resumption_countUnsaved)}
              readonly={Profile.isTransient || Profile.isRunning}
              on:keyup={() => validateClientResCount (row.index)} />

              <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].server_resumption_type} 
              labelText="Server ResType"
              invalidText= "{Profile.cs_groups[row.index].server_resumption_typeHelp}"
              invalid={(Profile.cs_groups[row.index].server_resumption_typeError || Profile.cs_groups[row.index].server_resumption_typeUnsaved)}
              readonly={Profile.isTransient || Profile.isRunning}
              on:keyup={() => validateServerResType (row.index)} />

              <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].server_resumption_count} 
              labelText="Server ResCount"
              invalidText= "{Profile.cs_groups[row.index].server_resumption_countHelp}"
              invalid={(Profile.cs_groups[row.index].server_resumption_countError || Profile.cs_groups[row.index].server_resumption_countUnsaved)}
              readonly={Profile.isTransient || Profile.isRunning}
              on:keyup={() => validateServerResCount (row.index)} />

              <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].client_tls_close_type} 
              labelText="Client CloseNotify"
              invalidText= "{Profile.cs_groups[row.index].client_tls_close_typeHelp}"
              invalid={(Profile.cs_groups[row.index].client_tls_close_typeError || Profile.cs_groups[row.index].client_tls_close_typeUnsaved)}
              readonly={Profile.isTransient || Profile.isRunning}
              on:keyup={() => validateClientCloseNotify (row.index)} /> 

              <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].server_tls_close_type} 
              labelText="Server CloseNotify"
              invalidText= "{Profile.cs_groups[row.index].server_tls_close_typeHelp}"
              invalid={(Profile.cs_groups[row.index].server_tls_close_typeError || Profile.cs_groups[row.index].server_tls_close_typeUnsaved)}
              readonly={Profile.isTransient || Profile.isRunning}
              on:keyup={() => validateServerCloseNotify (row.index)} /> 

            </FormGroup>

            <FormGroup legendText="Session">
              <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].max_active_conn_count} 
              labelText="Max ActConn"
              invalidText= "{Profile.cs_groups[row.index].max_active_conn_countHelp}"
              invalid={(Profile.cs_groups[row.index].max_active_conn_countError || Profile.cs_groups[row.index].max_active_conn_countUnsaved)}
              readonly={Profile.isTransient || Profile.isRunning}
              on:keyup={() => validateMaxActiveConn (row.index)} />

              <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].cs_data_len} 
              labelText="Client DataLen"
              invalidText= "{Profile.cs_groups[row.index].cs_data_lenHelp}"
              invalid={(Profile.cs_groups[row.index].cs_data_lenError || Profile.cs_groups[row.index].cs_data_lenUnsaved)}
              readonly={Profile.isTransient || Profile.isRunning}
              on:keyup={() => validateClientDataLen (row.index)} />

              <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].sc_data_len} 
              labelText="Server DataLen"
              invalidText= "{Profile.cs_groups[row.index].sc_data_lenHelp}"
              invalid={(Profile.cs_groups[row.index].sc_data_lenError || Profile.cs_groups[row.index].sc_data_lenUnsaved)}
              readonly={Profile.isTransient || Profile.isRunning}
              on:keyup={() => validateServerDataLen (row.index)} />

              <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].cs_starttls_len} 
              labelText="Client StartTls"
              invalidText= "{Profile.cs_groups[row.index].cs_starttls_lenHelp}"
              invalid={(Profile.cs_groups[row.index].cs_starttls_lenError || Profile.cs_groups[row.index].cs_starttls_lenUnsaved)}
              readonly={Profile.isTransient || Profile.isRunning}
              on:keyup={() => validateClientStartTlsLen (row.index)} />

              <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].sc_starttls_len} 
              labelText="Server StartTls"
              invalidText= "{Profile.cs_groups[row.index].sc_starttls_lenHelp}"
              invalid={(Profile.cs_groups[row.index].sc_starttls_lenError || Profile.cs_groups[row.index].sc_starttls_lenUnsaved)}
              readonly={Profile.isTransient || Profile.isRunning}
              on:keyup={() => validateServerStartTlsLen (row.index)} />

              <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].client_read_chunk_len} 
              labelText="Client ReadChunk"
              invalidText= "{Profile.cs_groups[row.index].client_read_chunk_lenHelp}"
              invalid={(Profile.cs_groups[row.index].client_read_chunk_lenError || Profile.cs_groups[row.index].client_read_chunk_lenUnsaved)}
              readonly={Profile.isTransient || Profile.isRunning}
              on:keyup={() => validateClientReadChunk (row.index)} />

              <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].server_read_chunk_len} 
              labelText="Server ReadChunk"
              invalidText= "{Profile.cs_groups[row.index].server_read_chunk_lenHelp}"
              invalid={(Profile.cs_groups[row.index].server_read_chunk_lenError || Profile.cs_groups[row.index].server_read_chunk_lenUnsaved)}
              readonly={Profile.isTransient || Profile.isRunning}
              on:keyup={() => validateServerReadChunk (row.index)} />                  

              <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].client_write_chunk_len} 
              labelText="Client WriteChunk"
              invalidText= "{Profile.cs_groups[row.index].client_write_chunk_lenHelp}"
              invalid={(Profile.cs_groups[row.index].client_write_chunk_lenError || Profile.cs_groups[row.index].client_write_chunk_lenUnsaved)}
              readonly={Profile.isTransient || Profile.isRunning}
              on:keyup={() => validateClientWriteChunk (row.index)} />

              <TextInput inline size="sm" bind:value={Profile.cs_groups[row.index].server_write_chunk_len} 
              labelText="Server WriteChunk"
              invalidText= "{Profile.cs_groups[row.index].server_write_chunk_lenHelp}"
              invalid={(Profile.cs_groups[row.index].server_write_chunk_lenError || Profile.cs_groups[row.index].server_write_chunk_lenUnsaved)}
              readonly={Profile.isTransient || Profile.isRunning}
              on:keyup={() => validateServerWriteChunk (row.index)} />                  
            </FormGroup>

            <FormGroup>
              <TextArea light labelText="Server Cert"
                placeholder="Enter server certificate in PEM format..."
                readonly={Profile.isTransient || Profile.isRunning}
                bind:value={Profile.cs_groups[row.index].server_cert}
                on:keyup={() => validateServerCert (row.index)}
                invalid={(Profile.cs_groups[row.index].server_certError || Profile.cs_groups[row.index].server_certUnsaved)}
                invalidText="{Profile.cs_groups[row.index].server_certHelp}"
              />
            </FormGroup>
            <FormGroup>
              <TextArea light labelText="Server Key"
                placeholder="Enter server key in PEM format..."
                readonly={Profile.isTransient || Profile.isRunning}
                bind:value={Profile.cs_groups[row.index].server_key}
                on:keyup={() => validateServerKey (row.index)}
                invalidText="{Profile.cs_groups[row.index].server_keyHelp}"
              />
            </FormGroup>

            <FormGroup>
              <button class="button is-small is-danger is-outlined" 
              disabled={Profile.isTransient || Profile.isRunning}
              on:click={() => { onMarkUnmarkDelete(row.index) } } >
                {#if Profile.cs_groups[row.index].fieldAttention=='mark-delete'}
                  UnMark Delete
                {:else}
                  Mark Delete
                {/if }
              </button>

              <button class="button is-small is-danger is-outlined" 
              disabled={Profile.isTransient || Profile.isRunning}
              on:click={() => { onApplyDefault(row.index) } } >
                Apply Default
              </button>
 
            </FormGroup>

          </div>

          <div class="column">
          </div>
        </div>
      </div>

      <div slot="cell" let:row let:cell>
        {#if cell.key == 'fieldAttention'}
          {#if cell.value == 'mark-delete'}
            <p><strong class="errmsg">x</strong></p>
          {:else if cell.value == 'field-update'}
            <p><strong class="errmsg">!</strong></p>
          {:else if cell.value == 'new-csg'}
            <p><strong class="errmsg">*</strong></p>
          {:else}
            <p><strong class="okmsg">&#10003;</strong></p>
          {/if}
        {:else}
          {cell.value}
        {/if}
      </div>

    </DataTable>
  </div>
  
  <div class="column is-12">

    <button class="button is-small is-info is-outlined" 
    disabled={Profile.isTransient || Profile.isRunning}
    on:click={onAddTrafficPath} >
    Add Traffic Path
    </button>      
    
  </div>

  <div class="column is-12">
  </div>

</div>

<div class="modal {showApplyDefault ? 'is-active' : ''}">
  <div class="modal-background"></div>
  <div class="modal-card box ">
    <header>
      <p class="modal-card-title ">Group Edit</p>
    </header>
    <section class="modal-card-body">
      <div class="columns is-multiline is-mobile">
        <div class="column"></div>

        <div class="column is-three-fifths">
          <FormGroup legendText="All Props">
            <Checkbox labelText="" checked={allPropsChecked} on:change={onAllPropsChecked} />
          </FormGroup>

          <FormGroup legendText="Interface">
            <Checkbox labelText="Client" bind:checked={clientInterfaceChecked} />
            <Checkbox labelText="Server" bind:checked={serverInterfaceChecked} />
          </FormGroup>

          <FormGroup legendText="Transport">
            <Checkbox labelText="Server Port" bind:checked={serverPortChecked} />
            <Checkbox labelText="Protocol" bind:checked={protocolChecked} />
          </FormGroup>
          
          <FormGroup legendText="TCP">
            <Checkbox labelText="Client Close" bind:checked={clientCloseChecked} />
            <Checkbox labelText="Server Close" bind:checked={serverCloseChecked} />
            <Checkbox labelText="Client SndBuffer" bind:checked={clientSndBufferChecked} />
            <Checkbox labelText="Server SndBuffer" bind:checked={serverSndBufferChecked} />
            <Checkbox labelText="Client RcvBuffer" bind:checked={clientRcvBufferChecked} />
            <Checkbox labelText="Server RcvBuffer" bind:checked={serverRcvBufferChecked} />
          </FormGroup>

          <FormGroup legendText="TLS">
            <Checkbox labelText="Client Version" bind:checked={clientVersionChecked} />
            <Checkbox labelText="Server Version" bind:checked={serverVersionChecked} />
            <Checkbox labelText="Client Ciphers" bind:checked={clientCiphersChecked} />
            <Checkbox labelText="Server Ciphers" bind:checked={serverCiphersChecked} />
            <Checkbox labelText="Client ResType" bind:checked={clientResTypeChecked} />
            <Checkbox labelText="Client ResCount" bind:checked={clientResCountChecked} />
            <Checkbox labelText="Server ResType" bind:checked={serverResTypeChecked} />
            <Checkbox labelText="Server ResCount" bind:checked={serverResCountChecked} />
            <Checkbox labelText="Client CloseNotify" bind:checked={clientCloseNotifyChecked} />
            <Checkbox labelText="Server CloseNotify" bind:checked={serverCloseNotifyChecked} />
          </FormGroup>          

          <FormGroup legendText="Session">
            <Checkbox labelText="Max ActConn" bind:checked={maxActionChecked} />
            <Checkbox labelText="Client DataLen" bind:checked={clientDataLenChecked} />
            <Checkbox labelText="Server DataLen" bind:checked={serverDataLenChecked} />
            <Checkbox labelText="Client StartTls" bind:checked={clientStartTlsChecked} />
            <Checkbox labelText="Server StartTls" bind:checked={serverStartTlsChecked} />
            <Checkbox labelText="Client ReadChunk" bind:checked={clientReadChunkChecked} />
            <Checkbox labelText="Server ReadChunk" bind:checked={serverReadChunkChecked} />
            <Checkbox labelText="Client WriteChunk" bind:checked={clientWriteChunkChecked} />
            <Checkbox labelText="Server WriteChunk" bind:checked={serverWriteChunkChecked} />
          </FormGroup>
          
          <FormGroup legendText="Certs, Keys">
            <Checkbox labelText="Server Cert, Key" bind:checked={serverCertKeyChecked} />
          </FormGroup>

          <FormGroup legendText="Selected CSGs">
            <Checkbox labelText="All" checked={allCsgChecked} on:change={onAllCsgChecked} />
            {#each csgCheckedList as csgCheck}
              <Checkbox labelText="{csgCheck.Name}" bind:checked={csgCheck.isChecked} />
            {/each}
          </FormGroup>

        </div>
        <div class="column"></div>
      </div>



      <div class="field is-grouped">
        <div class="control">
          <button class="button  is-info" disabled={Profile.markErrorFields} on:click={onApply}>Apply</button>
        </div>
        <div class="control">
          <button class="button  is-light" on:click={onClose}>Cancel</button>
        </div>
      </div>


    </section>
  </div>
</div>


<style>
  .profile-margin {
    margin-top: 0px;
    margin-left: 4rem;
    margin-right: 4rem;
  }

  .my-border {
    border: 1px solid grey;
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 10px;
    padding-bottom: 15px;
  }

  .breadcrumb-margin {
      margin-top: 8px;
      margin-left: 1rem;
  }

  .errmsg {
    color: red;
  }

  .okmsg {
    color: green;
  }

  .start_stop_border {
    padding-top: 0.5rem;
  }

</style>