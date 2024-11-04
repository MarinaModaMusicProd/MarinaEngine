<?php

namespace Common\Core\Exceptions;

class AccessResponseWithAction extends AccessResponseWithPermission
{
    public array|null $action;
}
