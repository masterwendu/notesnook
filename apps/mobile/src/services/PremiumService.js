import {CHECK_IDS} from 'notes-core/common';
import { updateEvent } from '../components/DialogManager/recievers';
import { Actions } from '../provider/Actions';
import {db} from '../utils/DB';
import {eOpenPremiumDialog, eOpenProgressDialog, eShowGetPremium} from '../utils/Events';
import {MMKV} from '../utils/mmkv';
import {eSendEvent, ToastEvent} from './EventManager';

let premiumStatus = 0;

async function setPremiumStatus() {
  try {
    let user = await db.user.getUser();
    if (!user) {
      premiumStatus = null;
      updateEvent({type:Actions.PREMIUM,state:get()})
    } else {
      premiumStatus = user.subscription.type;
      updateEvent({type:Actions.PREMIUM,state:get()})
    }
  } catch (e) {
    premiumStatus = null;
  }
  console.log(premiumStatus,"PREMIUM STATUS")
}

function get() {
  return premiumStatus === 1 || premiumStatus === 2;
}

async function verify(callback, error) {
  try {
    if (!premiumStatus) {
      if (error) {
        error();
        return;
      }

      eSendEvent(eOpenPremiumDialog);
      return;
    } else {
      if (!callback) console.warn('You must provide a callback function');
      await callback();
    }
  } catch (e) {
    // show error dialog TODO
  }
}

const onUserStatusCheck = async (type) => {
  let status = get();
  let message = null;

  if (!status) {
    switch (type) {
      case CHECK_IDS.noteColor:
        message = {
          context: 'sheet',
          title: 'Get Notesnook Pro',
          desc: 'To assign colors to a note get Notesnook Pro today.',
        };
        break;
      case CHECK_IDS.noteExport:
        message = {
          context: 'export',
          title: 'Export in PDF, MD & HTML',
          desc:
            'Get Notesnook Pro to export your notes in PDF, Markdown and HTML formats!',
        };
        break;
      case CHECK_IDS.noteTag:
        message = {
          context: 'sheet',
          title: 'Get Notesnook Pro',
          desc: 'To create more tags for your notes become a Pro user today.',
        };
        break;
      case CHECK_IDS.notebookAdd:
        eSendEvent(eOpenPremiumDialog);
        break;
      case CHECK_IDS.vaultAdd:
        message = {
          context: 'sheet',
          title: 'Add Notes to Vault',
          desc:
            'With Notesnook Pro you can add notes to your vault and do so much more! Get it now.',
        };
        break;
    }
    if (message) {
      eSendEvent(eShowGetPremium, message);
    }
  }

  return {type, result: status};
};

const showVerifyEmailDialog = () => {
  eSendEvent(eOpenProgressDialog, {
    title: 'Email not verified',
    icon: 'email',
    paragraph:
      'We have sent you an email confirmation link. Please check your email to verify your account.',
    action: async () => {
      try {
        let lastEmailTime = await MMKV.getItem('lastEmailTime');
        if (
          lastEmailTime &&
          Date.now() - JSON.parse(lastEmailTime) < 60000 * 10
        ) {
          ToastEvent.show(
            'Please wait before requesting another email',
            'error',
            'local',
          );
          console.log('error');
          return;
        }
        await db.user.sendVerificationEmail();
        await MMKV.setItem('lastEmailTime', JSON.stringify(Date.now()));
        ToastEvent.show('Verification email sent!', 'success', 'local');
      } catch (e) {
        ToastEvent.show(e.message, 'error', 'local');
        await MMKV.removeItem('lastEmailTime');
      }
    },
    actionText: 'Resend Confirmation Link',
    noProgress: true,
  });
};

export default {
  verify,
  setPremiumStatus,
  get,
  onUserStatusCheck,
  showVerifyEmailDialog,
};
