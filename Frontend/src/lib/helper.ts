import axios from "axios";

async function regSw(): Promise<ServiceWorkerRegistration | undefined> {
    if ('serviceWorker' in navigator) {
        // Race .ready against a timeout — in dev, hot reloads can leave the SW
        // stuck in "waiting" state, causing .ready to hang forever.
        const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('SW ready timed out')), 5000)
        )
        const registration = await Promise.race([
            navigator.serviceWorker.ready,
            timeoutPromise
        ])
        return registration
    }
    console.warn('Service workers are not supported in this browser')
}


async function subscribe(serviceWorkerReg: ServiceWorkerRegistration): Promise<PushSubscription | null>{
    let subscription = await serviceWorkerReg.pushManager.getSubscription()
    console.log(subscription);
    if(subscription === null){
        subscription = await serviceWorkerReg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_PUBLIC_VAPID_KEY)
        })
        console.log(subscription);
    } else {
        console.log("Subscription already exist", subscription);
    }

    return subscription
}

export async function enableNotification(): Promise<void>{
    const registeration = await regSw()
    if(!registeration) return;

    const permission = Notification.permission;
    if(permission === "denied") {
        alert("Notifications are blocked. Please enable them in your browser settings.")
        return
    };

    const subscription = await subscribe(registeration);
    if(!subscription) return;

    const baseURL = import.meta.env.VITE_API_BASE_URL || (
        import.meta.env.PROD
            ? (window.location.origin.includes("vercel.app") 
                ? "https://task-management-wjl7.onrender.com/api" 
                : "/api")
            : "http://localhost:8000/api"
    );

    await axios.post(`${baseURL}/subscribe`, subscription.toJSON(), {
        withCredentials: true
    });
}

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  // Pad the string to a multiple of 4 (base64 requirement)
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);

  // Convert the base64url to standart base64
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  // Decode to binary string
  const rawData = window.atob(base64);

  // Convert to Uint8Array
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
