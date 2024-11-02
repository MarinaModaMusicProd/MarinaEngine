<?php namespace Helpdesk\Controllers;

use Common\AI\ModifyTextWithAI;
use Common\Core\BaseController;
use Helpdesk\Models\Conversation;

class ModifyTextWithAIController extends BaseController
{
    public function __invoke()
    {
        $this->authorize('update', Conversation::class);

        $response = (new ModifyTextWithAI())->execute();

        return $this->success([
            'content' => $response['text'],
        ]);
    }
}
