// Split out so the messaging SDK is only fetched when the app actually boots,
// and never in the module-eval critical path.
import { listenForegroundMessages } from "../services/firebase/messaging";

void listenForegroundMessages();
