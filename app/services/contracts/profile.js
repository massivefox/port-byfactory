import axios from 'axios';
import DefaultProfile from 'images/default_profile.png';
import { changeIpfsToHttps, isIpfsUrl } from '../../utils/nft';
import { Contract, EXTENSIONS } from '../contract';

class ProfileContract extends Contract {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
  }

  async getProfile(user, daoName) {
    const cont = await this.loadExtContract(EXTENSIONS.PROFILE, daoName);

    let result;
    try {
      result = await this.call(cont, 'getProfile', [user]);
    } catch (e) {
      result = '';
    }

    if (!result || result === '') {
      return DefaultProfile;
    }

    let metaUri = result;
    if (isIpfsUrl(metaUri)) {
      metaUri = changeIpfsToHttps(metaUri);
    }

    const meta = await axios.get(metaUri);

    let imageUri = DefaultProfile;
    if (!meta.data?.image) return imageUri;
    if (isIpfsUrl(meta.data.image)) {
      imageUri = changeIpfsToHttps(meta.data.image);
    } else {
      imageUri = meta.data.image;
    }

    return imageUri;
  }

  async getDefaultProfile() {
    const cont = await this.loadExtContract(EXTENSIONS.PROFILE);

    let result = '';
    try {
      result = await this.call(cont, 'tokenURI', [1]);
    } catch (e) {
      return '';
    }

    if (!result || result === '') {
      return DefaultProfile;
    }
    let metaUri = result;
    if (isIpfsUrl(metaUri)) {
      metaUri = changeIpfsToHttps(metaUri);
    }

    const meta = await axios.get(metaUri);

    let imageUri = DefaultProfile;

    if (!meta.data?.image) return imageUri;

    if (isIpfsUrl(meta.data.image)) {
      imageUri = changeIpfsToHttps(meta.data.image);
    } else {
      imageUri = `${meta.data.image}?size=100`;
    }

    return { address: cont.address, imageUri };
  }

  async setProfile(user, nftContract, tokenId) {
    const params = window.caver.abi.encodeParameters(
      ['address', 'address', 'uint256'],
      [user, nftContract, tokenId],
    );
    return await this.execute(EXTENSIONS.PROFILE, 'setProfile', params);
  }
}

const profileContract = new ProfileContract();

export default profileContract;
