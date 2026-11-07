import censor from './censor'
import { getModules } from '@valenced/modules/finders'
import { withProps } from '@valenced/modules/finders/filters'
import { after, before } from '@valenced/patcher'

export default plugin ({
	start(api) {
	    const { cleanup } = api
	    
	    cleanup(
		    getModules(
		        withProps<any>('sendMessage', 'revealMessage'),
		        mod => {
		            cleanup(
		                before(mod, 'sendMessage', args => {
		                    const msg = args[1]
		                    if (msg?.content)
		                        args[1] = { ...msg, content: censor(msg.content) }
		                    return args
		                })
		            )
		        },
		        { max: 1 }
		    )
		)
	}
})
