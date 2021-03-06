import {
    DEFAULT_TIMEOUT,
    LIVE_BASE_URL,
    MBC_LIVE_SECRET_KEY_REGEX,
    NAS_LIVE_SECRET_KEY_REGEX,
    NAS_SANDBOX_SECRET_KEY_REGEX,
    SANDBOX_BASE_URL,
} from './config';
import {
    Payments,
    Sources,
    Tokens,
    Instruments,
    Webhooks,
    Events,
    Disputes,
    Files,
    Reconciliation,
    Customers,
    HostedPayments,
    Giropay,
    Ideal,
    Fawry,
    PagoFacil,
    Rapipago,
    Boleto,
    Baloto,
    Oxxo,
    Klarna,
    Sepa,
    PaymentLinks,
} from './index';

const determineHost = (key, options) => {
    // Unless specified, determine the hosted based on the secret key
    if (options && options.host) {
        return options.host;
    }

    if (key.startsWith('Bearer')) {
        key = key.replace('Bearer', '').trim();
    }

    return MBC_LIVE_SECRET_KEY_REGEX.test(key) || NAS_LIVE_SECRET_KEY_REGEX.test(key)
        ? LIVE_BASE_URL
        : SANDBOX_BASE_URL;
};

const determineSecretKey = (key) => {
    // Unless specified, check environment variables for the key
    let authKey = !key ? process.env.CKO_SECRET_KEY || '' : key;

    // In case of NAS static keys, append the Bearer prefix
    if (NAS_LIVE_SECRET_KEY_REGEX.test(authKey) || NAS_SANDBOX_SECRET_KEY_REGEX.test(authKey)) {
        authKey =
            authKey.startsWith('Bearer') || authKey.startsWith('bearer')
                ? authKey
                : `Bearer ${authKey}`;
    }

    return authKey;
};

const determinePublicKey = (options) => {
    // Unless specified, check environment variables for the key
    if (options && options.pk) {
        return options.pk;
    }
    return process.env.CKO_PUBLIC_KEY || '';
};

/**
 * Main Checkout.com SDK class
 *
 * @export
 * @class Checkout
 */
export default class Checkout {
    /**
     * Creates an instance of Checkout.com's SDK.
     *
     * Determines the environment based on the key
     *
     * @constructor
     * @param {string} [key] Secret Key /^(sk)
     * @param {Object}  [options] Configuration options
     * @memberof Payments
     */
    constructor(key, options) {
        this.config = {
            sk: determineSecretKey(key),
            pk: determinePublicKey(options),
            host: determineHost(determineSecretKey(key), options),
            timeout: options && options.timeout ? options.timeout : DEFAULT_TIMEOUT,
            agent: options && options.agent ? options.agent : undefined,
            headers: options && options.headers ? options.headers : {},
        };

        this.payments = new Payments(this.config);
        this.sources = new Sources(this.config);
        this.tokens = new Tokens(this.config);
        this.instruments = new Instruments(this.config);
        this.webhooks = new Webhooks(this.config);
        this.events = new Events(this.config);
        this.disputes = new Disputes(this.config);
        this.files = new Files(this.config);
        this.reconciliation = new Reconciliation(this.config);
        this.customers = new Customers(this.config);
        this.hostedPayments = new HostedPayments(this.config);
        this.giropay = new Giropay(this.config);
        this.ideal = new Ideal(this.config);
        this.fawry = new Fawry(this.config);
        this.pagoFacil = new PagoFacil(this.config);
        this.rapipago = new Rapipago(this.config);
        this.boleto = new Boleto(this.config);
        this.baloto = new Baloto(this.config);
        this.oxxo = new Oxxo(this.config);
        this.klarna = new Klarna(this.config);
        this.sepa = new Sepa(this.config);
        this.paymentLinks = new PaymentLinks(this.config);
    }
}
